import Link from "next/link";
import "./page.css";
import ReactMarkdown from "react-markdown";
import EpubChapterExtractor from "@/components/epub/EpubChapterExtractor";

async function getBookData(id) {
    try {
        const res = await fetch(
            `http://localhost:3000/api/v0/page/book/${id}`,
            {
                cache: "no-store",
            },
        );
        if (!res.ok) return null;
        return res.json();
    } catch (err) {
        return null;
    }
}

// lib/utils.js
export function formatRanobiDate(dateInt) {
    const s = dateInt?.toString() || "";

    if (s.length !== 8) return "Unknown Date";

    const year = s.substring(0, 4);
    const month = s.substring(4, 6);
    const day = s.substring(6, 8);

    const dateObj = new Date(year, parseInt(month) - 1, day);

    return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default async function PageBook({ params }) {
    const { id } = await params;
    const book = await getBookData(id);

    if (!book) {
        return <div className="p-10 text-center">Book not found.</div>;
    }

    return (
        <div className="book-page-container">
            <div className="post-header">
                <Link href="/">Home</Link>
                <span> / </span>
                <h5>{book.titles.english}</h5>
            </div>
            <div className="book-content">
                <div className="book-hero">
                    <div className="book-cover-con">
                        <img src={book.cover} alt={book.titles.english} />
                    </div>
                    <h1 className="page-title">{book.titles.english}</h1>
                    <h4 className="page-other-title">{book.titles.romaji}</h4>
                </div>
                <div className="page-description-con">
                    <h3>Description</h3>
                    <div className="page-description">
                        <ReactMarkdown>{book.description}</ReactMarkdown>
                    </div>
                    <div className="page-additional-info">
                        <p>
                            Released Date:{" "}
                            {formatRanobiDate(book.published_date[0]?.en)}
                        </p>
                        <p>
                            Author:{" "}
                            {book.staff.find((s) => s.role === "author")
                                ?.name || "N/A"}
                        </p>
                        <p>
                            Illustrator:{" "}
                            {book.staff.find((s) => s.role === "artist")
                                ?.name || "N/A"}
                        </p>
                        <p>
                            Publishers:{" "}
                            {book.publishers
                                .filter((p) => p.role === "publisher")
                                .map((p) => p.name)
                                .join(", ")}
                        </p>
                        <p>
                            Tags:{" "}
                            {book.tags
                                .map((tag) =>
                                    tag
                                        .split(" ")
                                        .map(
                                            (word) =>
                                                word.charAt(0).toUpperCase() +
                                                word.slice(1).toLowerCase(),
                                        )
                                        .join(" "),
                                )
                                .join(", ")}
                        </p>
                        <p>
                            Genres:{" "}
                            {book.genres
                                .map((genre) =>
                                    genre
                                        .split(" ")
                                        .map(
                                            (word) =>
                                                word.charAt(0).toUpperCase() +
                                                word.slice(1).toLowerCase(),
                                        )
                                        .join(" "),
                                )
                                .join(", ")}
                        </p>
                    </div>
                </div>
                <div className="chapter-wrapper">
                    <h3>Chapters Preview</h3>
                    <EpubChapterExtractor id={book.id} />
                </div>
            </div>
        </div>
    );
}
