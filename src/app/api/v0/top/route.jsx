import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getRelativeTime = (unixString) => {
    const timestamp = parseInt(unixString) * 1000;
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;

    if (diffInSeconds < minute) return "Just now";
    if (diffInSeconds < hour) return `${Math.floor(diffInSeconds / minute)} minutes ago`;
    if (diffInSeconds < day) return `${Math.floor(diffInSeconds / hour)} hours ago`;
    if (diffInSeconds < month) return `${Math.floor(diffInSeconds / day)} days ago`;

    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US');
}

async function getNovelData(ranobi_id) {
  if (!ranobi_id || ranobi_id === 0) return "No description available.";
  
  try {
    const response = await fetch(`https://ranobedb.org/api/v0/book/${ranobi_id}`);
    const data = await response.json();

    const book = data.book;

    return {
      rating: book?.rating?.score ?? 0.0,
      romaji: book?.romaji_orig || null,
      description: book?.description || "No description available."
    };
  } catch (error) {
    return "No description available.";
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;

  const filePath = path.join(process.cwd(), 'src/data/books.json');
  const fileData = await fs.readFile(filePath, 'utf8');
  const allBooks = JSON.parse(fileData);

  const booksWithDescriptions = [];

  for (const book of allBooks) {
    const additionalData = await getNovelData(book.ranobi_id);

    booksWithDescriptions.push({
      id: book.id,
      ranobi_id: book.ranobi_id,
      title_en: book.title,
      title_jp: additionalData.romaji,
      rating: additionalData.rating,
      description: additionalData.description,
      cover: book.cover,
      created_at: getRelativeTime(book.created_at)
    });
    
    await delay(50);
  }

  booksWithDescriptions.sort((a, b) => b.rating - a.rating);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedBooks = booksWithDescriptions.slice(startIndex, endIndex);
  const totalPage = Math.ceil(allBooks.length / limit);

  return NextResponse.json({
    total: allBooks.length,
    page,
    limit,
    totalPages: totalPage,
    data: paginatedBooks
  });
}