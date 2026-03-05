"use client";
import { useEffect, useState } from "react";
import "./LatestPost.css";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const getSlidingPages = (currentPage, total) => {
    const pageSize = 5;
    const totalWindow = Math.ceil(total / pageSize);
    const currentWindow = Math.ceil(currentPage / pageSize);

    const startPage = (currentWindow - 1) * pageSize + 1;
    const endPage = Math.min(currentWindow * pageSize, total);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return {
        pages,
        canGoPrev: currentWindow > 1,
        canGoNext: currentWindow < totalWindow,
        startPage,
        endPage,
    };
};

function BookList() {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const limit = 15;

    useEffect(() => {
        const loadBooks = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/v0/latest?page=${page}&limit=${limit}`,
                );
                const result = await response.json();

                setBooks(result.data || []);
                setTotalPages(result.totalPages || 1);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, [page]);

    const { pages, canGoPrev, canGoNext, startPage, endPage } = getSlidingPages(
        page,
        totalPages,
    );

    const goToPrevGroup = () => {
        setPage(Math.max(1, startPage - 1));
    };

    const goToNextGroup = () => {
        setPage(Math.min(totalPages, endPage + 1));
    };

    return (
        <div className="latest-container">
            <div className="post-con-header">
                <h3>Recently Updated</h3>
                {!loading && (
                    <div className="pagination">
                        <button
                            disabled={!canGoPrev}
                            onClick={goToPrevGroup}
                            title="Previous 5 pages"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {pages.map((p) => (
                            <button
                                key={p}
                                className={page === p ? "active" : ""}
                                onClick={() => setPage(p)}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            disabled={!canGoNext}
                            onClick={goToNextGroup}
                            title="Next 5 pages"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
            <ul className="latest-ul">
                {loading
                    ? Array.from({ length: limit }).map((_, index) => (
                          <li key={`shimmer-${index}`}>
                              <div className="shimmer-box"></div>
                          </li>
                      ))
                    : books.map((book) => (
                          <li key={book.id} className="book-item">
                              <Link
                                  href={`/book/${book.id}`}
                                  className="book-link-wrapper"
                              >
                                  <div className="book-card">
                                      <span className="ratingBadge">
                                          {Number(book.rating || 0).toFixed(1)}
                                      </span>
                                      <img
                                          src={book.cover}
                                          alt={book.title_en}
                                      />
                                      <span className="timeBadge">
                                          {book.created_at}
                                      </span>
                                  </div>
                                  <h3>{book.title_en}</h3>
                              </Link>
                          </li>
                      ))}
            </ul>
        </div>
    );
}

export default BookList;
