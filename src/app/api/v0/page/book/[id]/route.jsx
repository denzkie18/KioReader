import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // Prevent 204/Static optimization issues

async function getNovelData(ranobi_id) {
  if (!ranobi_id || ranobi_id === 0) return null;

  try {
    const response = await fetch(
      `https://ranobedb.org/api/v0/book/${ranobi_id}`,
    );
    if (!response.ok) return null;

    const data = await response.json();
    const book = data.book;

    const firstEdition = book?.editions?.[0];
    const staffList = firstEdition?.staff || [];
    const publisherList = book?.publishers || [];

    return {
      title_en: book?.title || null,
      title_jp: book?.title_orig || null,
      romaji: book?.romaji_orig || null,
      description: book?.description || "No description available.",
      staff: {
        author:
          staffList.find((s) => s.role_type === "author")?.romaji || "Unknown",
        illustrator:
          staffList
            .filter((s) => s.role_type === "artist")
            .map((s) => s.romaji || s.name)
            .join(", ") || "Unknown",
      },
      publishers: publisherList.map((p) => ({
        name: p.name,
        role: p.publisher_type,
      })),
    };
  } catch (error) {
    console.error("External API Error:", error);
    return null;
  }
}

function getMaskedLink(url) {
  if (!url) return "";
  return Buffer.from(url).toString("base64");
}

export async function GET(request, { params }) {
  try {
    // 1. Properly await params
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const filePath = path.join(process.cwd(), "src/data/books.json");
    const fileData = await fs.readFile(filePath, "utf8");
    const allBooks = JSON.parse(fileData);

    // 2. Find the book
    const book = allBooks.find((b) => b.id === parseInt(id));

    if (!book) {
      return NextResponse.json(
        { error: "Book not found in database" },
        { status: 404 },
      );
    }

    // 3. Await external data
    const bookData = await getNovelData(book.ranobi_id);

    // 4. Construct response
    const bookInformation = {
      id: book.id,
      ranobi_id: book.ranobi_id,
      titles: {
        english: bookData?.title_en || book.title,
        romaji: bookData?.romaji || null,
        native: bookData?.title_jp || null,
      },
      cover: book.cover,
      description: bookData?.description || "No description available.",
      staff: bookData?.staff || { author: "Unknown", illustrator: "Unknown" },
      publishers: bookData?.publishers || [],
      links: {
        epub: getMaskedLink(book.epub),
        pdf: getMaskedLink(book.pdf),
      },
    };

    // Ensure we ARE returning the response
    return NextResponse.json(bookInformation);
  } catch (err) {
    console.error("Route Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: err.message },
      { status: 500 },
    );
  }
}
