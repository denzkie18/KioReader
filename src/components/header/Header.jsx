import { TextAlignStart, Search } from 'lucide-react';
import './Header.css'

function LeftSide ({ onToggle }) {
	const MenuBtn = (
		<div className="menu-button" onClick={onToggle}>
			<TextAlignStart />
		</div>
	)

	const BrandName = (
		<div className="brand-name">
			<h1>KioReader</h1>
		</div>
	)

	return (
		<div className="left-side">
			{MenuBtn}
			{BrandName}
		</div>
	)
}

function RideSide () {
	const Form = (
		<form id="form">
			<label htmlFor="search">
				<input type="search" name="search" id="search" placeholder="Search novel..." autoComplete="off" />
				<Search />
			</label>
		</form>
	)

	return (
		<div className="right-side">
			{Form}
		</div>
	)
}

export default function Header ({ onToggle }) {
	return (
		<header>
			<LeftSide onToggle={onToggle} />
			<RideSide />
		</header>
	)
}