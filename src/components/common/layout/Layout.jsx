import './Layout.scss';

export default function Layout({ title, children }) {
	return (
		<section className={`layout ${title}`}>
			<figure>
				<p>Portfolio</p>
			</figure>

			<div className='content'>
				<h1>{title}</h1>
				{children}
			</div>
		</section>
	);
}
