'use client';
import { useEffect, useState } from 'react';
import './PopularPost.css';
import { Flame } from 'lucide-react';

function BookList() {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const limit = 10;

    useEffect(() => {
        const loadBooks = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/v0/popularity?page=${page}&limit=${limit}`);
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
        <div className="popular-container">
            <div className="post-con-header">
                <h3>Most Popular</h3>
            </div>
            <ul className="popular-ul">
		    {loading ? (
		      Array.from({ length: limit }).map((_, index) => (
		        <li key={`shimmer-${index}`}>
		          <div className="shimmer-popular-box" style={{ width: '50px', height: '50px', borderRadius: '50px', flexShrink: '0' }}></div>
		          <div className="shimmer-body">
		            <div className="shimmer-popular-box" style={{ width: '100%', height: '40px', borderRadius: '5px' }}></div>
		          </div>
		        </li>
		      ))
		    ) : (
		      books.map((book, index) => (
		        <li
		          key={book.id}
		          className="book-item">
		          <div className="list-indicator">{index + 1}</div>
		          <div className="popular-details">
		            <h3>{book.titles?.english || book.titles?.romaji}</h3>
		            <div className="popular-points">
		            	<Flame />
		            	<p>{book.popularity}</p>
		            </div>
		          </div>
		          <div className="popular-cover">
		          	<img src={book.cover_url} alt="Popular Cover" />
		          </div>
		        </li>
		      ))
		    )}
		  </ul>
        </div>
    )

}

export default BookList