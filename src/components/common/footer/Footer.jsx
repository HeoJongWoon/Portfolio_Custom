import React from 'react';
import './Footer.scss';

const Footer = () => {
	return (
		<footer>
			<div className='top'>
				<h2>Footer</h2>
				<div className='footerMenu'>
					<ul>
						<li>
							<h3>COMMUNITY</h3>
						</li>

						<li>About</li>
						<li>Submit on issue</li>
						<li>GitHub Repo</li>
						<li>Slack</li>
					</ul>
					<ul>
						<li>
							<h3>GETTING STARTED</h3>
						</li>
						<li>Introduction</li>
						<li>Documentation</li>
						<li>Usage</li>
						<li>Globals</li>
						<li>Elements</li>
						<li>Collections</li>
						<li>Themes</li>
					</ul>
					<ul>
						<li>
							<h3>RESOURSES</h3>
						</li>
						<li>API</li>
						<li>Form</li>
						<li>Visibility</li>
						<li>Accesssibility</li>
						<li>Community</li>
						<li>DesignDefined</li>
						<li>Marketplace</li>
					</ul>
				</div>
			</div>
			<div className='lower'>
				<span>ⓒ 2023. Portfolio. All rights reserved.</span>
			</div>
		</footer>
	);
};

export default Footer;
