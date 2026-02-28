import React, { useState, useEffect } from 'react';
import { TextAlignStart, Search, Sun, Moon } from 'lucide-react';
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

	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
	    const savedTheme = localStorage.getItem('theme');
	    // Check if theme is saved OR if the user prefers dark mode via system settings
	    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	    
	    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
	      setIsDark(true);
	    }
	  }, []);
	
	useEffect(() => {
	    if (isDark) {
	      document.documentElement.setAttribute('dark-theme', 'dark');
	      localStorage.setItem('theme', 'dark');
	    } else {
	      document.documentElement.removeAttribute('dark-theme');
	      localStorage.setItem('theme', 'light');
	    }
	  }, [isDark]);

	const Form = (
	  <>
	    <form id="form">
	      <label htmlFor="search">
	        <input type="search" name="search" id="search" placeholder="Search novel..." autoComplete="off" />
	        <Search />
	      </label>
	    </form>
	    
	    <div className="theme-switch-con">
	      <label className="theme-switch" htmlFor="checkbox">
	        <input type="checkbox" id="checkbox" checked={isDark} onChange={() => setIsDark(!isDark)}/>
	        <div className="slider">
	          <span className="ball">
	            <Sun className="icon-sun" />
	            <Moon className="icon-moon" />
	          </span>
	        </div>
	      </label>
	    </div>
	  </>
	);

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