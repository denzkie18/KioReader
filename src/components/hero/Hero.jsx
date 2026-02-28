import { Library } from 'lucide-react';
import './Hero.css';

function Hero () {
	return (
		<div className="hero-section">
			<div className="hero-wrapper">
				<div className="hero-cover">
					<img src="https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx113533-u3D4i0jHzt2z.jpg" alt="The Angel Next Door Spoils Me Rotten" />
				</div>
				<div className="hero-details">
					<h1>Welcome to KioReader</h1>
					<p>Your destination for light novel reading. Discover, read, and enjoy thousands of titles from our collection.</p>
					<button className="browse-books">Browse Collection</button>
					<div className="hero-short-dtls">
						<div><Library /> 1k+ Light Novels</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Hero