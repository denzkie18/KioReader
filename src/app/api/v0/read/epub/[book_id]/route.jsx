import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

function slugify(text) {
    return text
        .toString() // Ensure it's a string
        .toLowerCase() // Convert to lowercase
        .trim() // Remove leading/trailing whitespace
        .replace(/[^\w\s-]/g, "") // Remove all non-word chars (except spaces/hyphens)
        .replace(/[\s_]+/g, "-") // Replace spaces and underscores with a hyphen
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Example usage with your Konosuba title:
const title =
    "Konosuba: God's Blessing on This Wonderful World!, Vol. 17: God's Blessing on These Wonderful Adventurers!";
const cleanSlug = slugify(title);

console.log(cleanSlug);
// Output: konosuba-gods-blessing-on-this-wonderful-world-vol-17-gods-blessing-on-these-wonderful-adventurers

export async function GET(request, { params }) {
    // 1. Match the name to your folder [book_id]
    const { book_id } = await params;

    try {
        // 2. Adjust path based on your Fedora file structure
        const filePath = path.join(process.cwd(), "src/data/books.json");
        const rawData = await fs.readFile(filePath, "utf-8");
        const books = JSON.parse(rawData);

        // 3. Compare as strings to avoid type mismatch
        const book = books.find((b) => String(b.id) === String(book_id));

        if (!book) {
            console.log("Book not found for ID:", book_id);
            return NextResponse.json(
                { error: "Book link not found" },
                { status: 404 },
            );
        }

        const filename = slugify(book.title);

        const response = await fetch(book.epub, {
            method: "GET",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Referer: "https://server.elscione.com/",
            },
        });

        if (!response.ok) {
            throw new Error(`External server error: ${response.status}`);
        }

        const blob = await response.blob();

        return new NextResponse(blob, {
            headers: {
                "Content-Type": "application/epub+zip",
                "Access-Control-Allow-Origin": "*",
                "Content-Disposition": `inline; filename="${filename}.epub"`,
            },
        });
    } catch (error) {
        console.error("Proxy Error:", error.message);
        return NextResponse.json(
            { error: "CORS Proxy Error", details: error.message },
            { status: 500 },
        );
    }
}
