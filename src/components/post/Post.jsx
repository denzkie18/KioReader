import Hero from '@/components/hero/Hero';
import PostLatest from '@/components/latest/LatestPost';
import PostRated from '@/components/top/TopRated'
import './Post.css';

function Post () {
	return (
		<div className="center-panel">
			<Hero />
			<PostLatest />
			<PostRated />
		</div>
	)
}

export default Post