'use client'
import { useEffect, useState } from 'react';
import './TopRated.css';
import { Star } from 'lucide-react';

function BookList() {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const limit = 8;

    useEffect(() => {
        const loadBooks = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/v0/top?page=${page}&limit=${limit}`);
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

    return (
        <div className="top-container">
            <div className="post-con-header">
                <h3>Top Rated Books</h3>
            </div>
            <ul className="top-ul">
                { loading ? (
                    Array.from({ length: limit }).map((_, index) => (
                        <li key={`shimmer-${index}`}>
                            <div className="shimmer-top-box" style={{width: '220px', height: '210px'}}></div>
                            <div className="shimmer-body">
                                <div className="shimmer-top-box" style={{width: '100%', height: '20px', borderRadius: '5px'}}></div>
                                <div className="shimmer-top-box" style={{width: '70%', height: '20px', borderRadius: '5px'}}></div>
                                <div className="shimmer-top-box" style={{width: '100%', height: '100px', borderRadius: '5px'}}></div>
                            </div>
                        </li>
                    ))
                ) : (
                    books.map((book) => (
                        <li key={book.id} className="book-item">
                            <div className="book-card">
                                <img src={book.cover} alt={book.title_en} />
                            </div>
                            <div className="top-details">
                                <h3>{book.title_en}</h3>
                                <div className="star-rating">
                                    <Star />
                                    <p>{book.rating.toFixed(1)}</p>
                                </div>
                                <p className="synopsis">{book.description}</p>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    )

}

export default BookList