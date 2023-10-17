import Layout from '../../common/layout/Layout';
import { useEffect, useState, useRef } from 'react';
import './Department.scss';
const path = process.env.PUBLIC_URL;
//1.useEffect로 컴포넌트 마운트되자마자 fetch외부데이터 가져옴
//2.데이터가 다 받아지면 useState로 state에 해당 담아줌
//3.return문 안족에 state값을 map으로 반복돌면서 JSX출력

export default function Department() {
	// const refSliderWrap = useRef(null);
	const [Department, setDepartment] = useState([]);
	const [Subpage, setSubpage] = useState([]);

	// const next = () => {
	// 	const wrap = refSliderWrap.current;
	// 	wrap.append(wrap.firstElementChild);
	// };

	// const prev = () => {
	// 	const wrap = refSliderWrap.current;
	// 	wrap.prepend(wrap.lastElementChild);
	// };

	useEffect(() => {
		fetch(`${path}/DB/department.json`)
			.then((data) => data.json())
			.then((json) => {
				setDepartment(json.members);
			});
		fetch(`${path}/DB/subpage.json`)
			.then((data) => data.json())
			.then((json) => {
				setSubpage(json.subbox);
			});
	}, []);

	return (
		<Layout title={'Department'}>
			{/* <div className='sliderBox'>
				<button className='b' onClick={prev}>
					prev
				</button>
				<button className='next' onClick={next}>
					next
				</button>

				<section className='sliderWrap' ref={refSliderWrap}>
					<article>1</article>
					<article>2</article>
					<article>3</article>
					<article>4</article>
					<article>5</article>
				</section>
			</div> */}
			<div className='topContainer'>
				<div className='inContainer'>
					<div className='txtBox'>
						<span>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, eligendi quos. Quos iusto, accusamus commodi repudiandae tempora nostrum debitis
							ipsa fugiat voluptatibus. Quo dignissimos impedit enim. Corrupti officia facere modi?
						</span>
					</div>
					<div className='imgBox'>
						<img src='img/First.jpg' alt='1' />
						<img src='img/First.jpg' alt='1' />
					</div>
				</div>
			</div>
			<h1>Our team</h1>
			<div className='container'>
				<div className='memberBox'>
					{Department.map((member, idx) => {
						return (
							<article key={idx}>
								<div className='pic'>
									<img src={`${path}/img/${member.pic}`} alt={member.name} />
									<img src={`${path}/img/${member.pic}`} alt={member.name} />
								</div>
								<h2>{member.name}</h2>
								<p>{member.position}</p>
							</article>
						);
					})}
				</div>
			</div>
			<h1 className='lastTit'>Sub</h1>
			<div className='bottomContainer'>
				<div className='subBox'>
					{Subpage.map((subbox, idx) => {
						return (
							<article key={idx}>
								<div className='pic'>
									<img src={`${path}/img/${subbox.pic}`} alt={subbox.name} />
									<img src={`${path}/img/${subbox.pic}`} alt={subbox.name} />
								</div>
								<h2>{subbox.date}</h2>
								<p>{subbox.txt}</p>
							</article>
						);
					})}
				</div>
			</div>
		</Layout>
	);
}
