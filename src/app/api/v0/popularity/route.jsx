import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches specific novel data from AniList using GraphQL POST request
 */
async function getNovelData(anilist_id) {
  if (!anilist_id) return null;

  const query = `
    query ($id: Int) {
      Media (id: $id, type: MANGA, format: NOVEL) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
          medium
        }
  		bannerImage
        popularity
        description
      }
    }
  `;

  const variables = { id: anilist_id };

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error("AniList API Error:", result.errors);
      return null;
    }

    const media = result.data.Media;

    return {
      titles: {
        english: media?.title?.english || media?.title?.romaji || "Unknown Title",
        romaji: media?.title?.romaji || "Unknown Title"
      },
     cover: media?.coverImage?.large || media?.coverImage?.medium || "/fallback-cover.jpg",
      banner: media?.bannerImage || null,
      description: media?.description || "No description available.",
      popularity: media?.popularity || 0
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;

  try {
    // 1. Load the local JSON data
    const filePath = path.join(process.cwd(), 'src/data/series.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const allSeries = JSON.parse(fileData);

    // 2. Paginate the list BEFORE fetching external data (Performance Boost)
    const startIndex = (page - 1) * limit;
    const paginatedRawData = allSeries.slice(startIndex, startIndex + limit);

    const seriesList = [];

    // 3. Loop only through the subset of books
    for (const book of paginatedRawData) {
      const additionalData = await getNovelData(book.anilist_id);

      if (additionalData) {
        seriesList.push({
          id: book.id,
          ranobi_id: book.ranobi_id,
          anilist_id: book.anilist_id,
          cover_url: additionalData.cover,
          banner: additionalData.banner,
          titles: additionalData.titles,
          description: additionalData.description,
          popularity: additionalData.popularity
        });
      } else {
        // Fallback if AniList fails for a specific ID
        seriesList.push({
          id: book.id,
          ranobi_id: book.ranobi_id,
          anilist_id: book.anilist_id,
          title: book.title,
          description: "Could not fetch data from AniList.",
          popularity: 0
        });
      }
      
      // Short delay to respect AniList rate limits (90 requests per minute)
      await delay(50);
    }

    // 4. Sort the current page results by popularity
    seriesList.sort((a, b) => b.popularity - a.popularity);

    const totalPages = Math.ceil(allSeries.length / limit);

    return NextResponse.json({
      total: allSeries.length,
      page,
      limit,
      totalPages: totalPages,
      data: seriesList
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to load series data" }, { status: 500 });
  }
}