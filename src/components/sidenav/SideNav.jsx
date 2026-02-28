import { House, Library, Book } from 'lucide-react';
import './SideNav.css'

function SideNavItems () {
	return (
		<>
			<li className="nav-item active"><a href="#">
				<House />
				<span>Home</span>
			</a></li>
			<li className="nav-item"><a href="#">
				<Library />
				<span>Series</span>
			</a></li>
			<li className="nav-item"><a href="#">
				<Book />
				<span>Books</span>
			</a></li>
		</>
	)
}

function SideNav({ isCollapsed }) {
	return (
		<div className={`side-nav ${isCollapsed ? 'collapsed' : ''}`}>
			<ul className="side-nav-list">
				<SideNavItems />
			</ul>
		</div>
	)
}

export default SideNav