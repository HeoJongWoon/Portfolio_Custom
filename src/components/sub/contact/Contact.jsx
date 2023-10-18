import Layout from '../../common/layout/Layout';
import './Contact.scss';
import emailjs from '@emailjs/browser';
import { useRef, useEffect, useState } from 'react';
const path = process.env.PUBLIC_URL;

export default function Contact() {
	const form = useRef(null);
	const map = useRef(null);
	const view = useRef(null);
	const instance = useRef(null);
	const [Contact, setContact] = useState([]);
	const [Traffic, setTraffic] = useState(false);
	const [Index, setIndex] = useState(0);
	const [IsMap, setIsMap] = useState(true);

	const { kakao } = window;
	const info = useRef([
		{
			title: '삼성역 코엑스',
			latlng: new kakao.maps.LatLng(37.51100661425726, 127.06162026853143),
			imgSrc: `${process.env.PUBLIC_URL}/img/marker1.png`,
			imgSize: new kakao.maps.Size(232, 99),
			imgPos: { offset: new kakao.maps.Point(116, 99) },
		},
		{
			title: '넥슨 본사',
			latlng: new kakao.maps.LatLng(37.40211707077346, 127.10344953763003),
			imgSrc: `${process.env.PUBLIC_URL}/img/marker2.png`,
			imgSize: new kakao.maps.Size(232, 99),
			imgPos: { offset: new kakao.maps.Point(116, 99) },
		},
		{
			title: '서울 시청',
			latlng: new kakao.maps.LatLng(37.5662952, 126.9779451),
			imgSrc: `${process.env.PUBLIC_URL}/img/marker3.png`,
			imgSize: new kakao.maps.Size(232, 99),
			imgPos: { offset: new kakao.maps.Point(116, 99) },
		},
	]);

	//위의 정보값을 활용한 마커 객체 생성
	const marker = new kakao.maps.Marker({
		position: info.current[Index].latlng,
		image: new kakao.maps.MarkerImage(info.current[Index].imgSrc, info.current[Index].imgSize, info.current[Index].imgPos),
	});

	//지도위치를 중심으로 이동시키는 핸들러 함수 제작
	const setCenter = () => {
		console.log('지도화면에서 마커 가운데 보정');
		// 지도 중심을 이동 시킵니다
		instance.current.setCenter(info.current[Index].latlng);
	};

	useEffect(() => {
		//Index값이 변경될때마다 새로운 지도 레이어가 중첩되므로
		//일단은 기존 map안의 모든 요소를 없애서 초기화
		map.current.innerHTML = '';
		//객체 정보를 활용한 지도 객체 생성
		instance.current = new kakao.maps.Map(map.current, {
			center: info.current[Index].latlng,
			level: 1,
		});
		//마커 객체에 지도 객체 연결
		marker.setMap(instance.current);

		//지도 타입 변경 UI추가
		const mapTypeControl = new kakao.maps.MapTypeControl();
		instance.current.addControl(mapTypeControl, kakao.maps.ControlPosition.BOTTOMLEFT);

		//지도 생성시 마커 고정적으로 적용되기 때문에 브라우저 리사이즈시 마커가 가운데 위치하지 않는 문제
		//마커를 가운데 고정시키는 함수를 제작한뒤 윈도우객체 직접 resize이벤트 발생시마다 핸들러함수 호출해서 마커위치 보정

		//Contact페이지에만 동작되야 되는 핸들러함수를 최상위 객체인 window에 직접 연결했기 때문에
		//라우터로 다른페이지이동하더라도 계속해서 setCenter호출되는 문제점 발생
		//해결방법: Contact 컴포넌트가 언마운트시 강제로 윈도우객체에서 setCenter핸들러를 제거
		window.addEventListener('resize', setCenter);

		//로드뷰 관련 코드
		new kakao.maps.RoadviewClient().getNearestPanoId(
			info.current[Index].latlng,
			100, //해당 지도의 위치값에서 반경 100미터 안에 제일 가까운 도로 기준으로 로드뷰화면 생성
			(panoId) => {
				new kakao.maps.Roadview(view.current).setPanoId(panoId, info.current[Index].latlng);
			}
		);

		return () => {
			window.removeEventListener('resize', setCenter);
		};
	}, [Index]); //Index값이 변경될때마다 지도화면이 다시 갱신되어야 하므로 Index값을 의존성 배열에 등록

	useEffect(() => {
		//traffic 값이 바뀔때마다 실행될 구문
		Traffic ? instance.current.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC) : instance.current.removeOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
	}, [Traffic]);

	const resetForm = () => {
		const nameForm = form.current.querySelector('.nameEl');
		const mailForm = form.current.querySelector('.emailEl');
		const msgForm = form.current.querySelector('.msgEl');
		nameForm.value = '';
		mailForm.value = '';
		msgForm.value = '';
	};

	//form mail 기능함수
	const sendEmail = (e) => {
		e.preventDefault();

		const nameForm = form.current.querySelector('.nameEl');
		const mailForm = form.current.querySelector('.emailEl');
		const msgForm = form.current.querySelector('.msgEl');

		if (!nameForm.value || !mailForm.value || !msgForm.value) return alert('사용자이름, 이메일주소, 문의내용은 필수 입력사항입니다.');

		//sendForm메서드는 각 키값을 문자열로만 인수로 전달되도록 type지정되어 있기 때문에
		//변수를 `${}`로 감싸서 문자형식으로 전달

		emailjs.sendForm(`${process.env.REACT_APP_SERVICE_ID}`, `${process.env.REACT_APP_TEMPLATE_ID}`, form.current, `${process.env.REACT_APP_PUBLIC_KEY}`).then(
			(result) => {
				alert('문의내용이 메일로 발송되었습니다.');
				console.log(result);
				resetForm();
			},
			(error) => {
				alert('문의내용 전송에 실패했습니다.');
				console.log(error);
				resetForm();
			}
		);
	};

	useEffect(() => {
		fetch(`${path}/DB/contact.json`)
			.then((data) => data.json())
			.then((json) => {
				setContact(json.about);
			});
	}, []);

	return (
		<Layout title={'Contact'}>
			<div className='upperBox'>
				<div id='mailbox'>
					<form ref={form} onSubmit={sendEmail}>
						<div className='texBox'>
							<h2>Send a Messge</h2>
							<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat distinctio saepe minus cumque deserunt tempore facere et est quia rem.</p>
						</div>

						<div className='upper'>
							<label>Name</label>
							<input type='text' name='user_name' className='nameEl' />

							<label>Email</label>
							<input type='email' name='user_email' className='emailEl' />
						</div>

						<div className='lower'>
							<label>Message</label>
							<textarea name='message' className='msgEl' />
						</div>

						<div className='btnPd'>
							<div className='btnSet'>
								<input type='reset' value='Cancel' />
								<input type='submit' value='Send' />
							</div>
						</div>
					</form>
				</div>

				<div id='etc'>
					{Contact.map((about, idx) => {
						return (
							<div className='txtSc'>
								<article key={idx}>
									<h2>{about.tit}</h2>
									<p>{about.lorem}</p>
									<span>{about.information}</span>
								</article>
							</div>
						);
					})}
				</div>
			</div>

			<div id='mapBox'>
				<div className='btnAll'>
					<div className='btnSet'>
						<button onClick={() => setTraffic(!Traffic)}>{Traffic ? '교통정보 끄기' : '교통정보 켜기'}</button>

						<button onClick={setCenter}>지도 위치 초기화</button>
						<button onClick={() => setIsMap(!IsMap)}>{IsMap ? '로드뷰보기' : '지도보기'}</button>
					</div>
					<ul>
						{info.current.map((el, idx) => (
							<li
								className={Index === idx ? 'on' : ''}
								key={idx}
								onClick={() => {
									setIndex(idx);
									setIsMap(true);
								}}
							>
								{el.title}
							</li>
						))}
					</ul>
				</div>
				<div className='container'>
					<div className={`view ${IsMap ? '' : 'on'}`} ref={view}></div>
					<div className={`map ${IsMap ? 'on' : ''}`} ref={map}></div>
				</div>

				{/* 데이터기반으로 자동 버튼 생성 및 자동 이벤트 연결 처리 */}
			</div>
			<div className='faqBox'>
				<div className='faqtit'>
					<p>FAQ</p>
					<h1>Frequently Asked Questions</h1>
				</div>
				<div className='faqtxt'>
					<h2>Lorem ipsum dolor sit amet.</h2>
					<span>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor expedita possimus consequatur. Ratione velit corrupti, quam praesentium veniam nulla
						enim hic. Unde, atque.
					</span>
					<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
					<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
					<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
					<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
				</div>
			</div>
		</Layout>
	);
}
