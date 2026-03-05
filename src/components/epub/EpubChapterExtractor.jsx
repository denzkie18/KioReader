"use client";
import React, { useEffect, useState } from "react";
import ePub from "epubjs";

export default function EpubChapters({ id }) {
    const [toc, setToc] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        let book;

        async function loadEpub() {
            try {
                setLoading(true);

                // 1. Fetch the file manually as an ArrayBuffer
                // This prevents epubjs from trying to fetch sub-files from your API
                const response = await fetch(`/api/v0/read/epub/${id}`);
                if (!response.ok) throw new Error("Failed to fetch EPUB file");

                const arrayBuffer = await response.arrayBuffer();

                // 2. Initialize ePub with the ArrayBuffer
                book = ePub(arrayBuffer);

                // 3. Wait for navigation (TOC) to load
                const nav = await book.loaded.navigation;

                console.log("Navigation loaded:", nav.toc);
                setToc(nav.toc || []);
                setLoading(false);
            } catch (err) {
                console.error("EPUB Error:", err);
                setError("Failed to parse chapters.");
                setLoading(false);
            }
        }

        loadEpub();

        return () => {
            if (book) {
                book.destroy();
            }
        };
    }, [id]);

    if (loading) return <div className="loader">Parsing EPUB...</div>;
    if (error) return <p className="error">{error}</p>;

    return (
        <ul className="chapter-list">
            {toc.length > 0 ? (
                toc.map((chapter, index) => (
                    <li key={chapter.id || index} className="chapter-item">
                        <span>{chapter.label?.trim()}</span>
                    </li>
                ))
            ) : (
                <p>No chapters found.</p>
            )}
        </ul>
    );
}
