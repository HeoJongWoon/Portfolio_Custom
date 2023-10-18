import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

//비동기 서버통신으로 데이터를 전달받아서 내부적으로 action타입을 자동 생성해서 액션객체 생성까지 완료하는 함수
export const fetchYoutube = createAsyncThunk('youtube/request', async () => {
	const api_key = process.env.REACT_APP_YOUTUBE_API;
	const baseURL = 'https://www.googleapis.com/youtube/v3/playlistItems';
	const pid = 'PL7xqVk2j6DQvIFBj0goyv3OYqsiQR6-2X';
	const num = 10;
	const resultURL = `${baseURL}?key=${api_key}&part=snippet&playlistId=${pid}&maxResults=${num}`;

	const result = await axios.get(resultURL);
	return result.data.items;
});
//{type:'대기'}
//{type:'성공': payload:[데이터]}
//{type:'실패': payload:에러객체}

//createAsyncThunk가 반환하는 action객체를 받아서 전역스토어 데이터를 변형하는 reducer함수등록
const youtubeSlice = createSlice({
	name: 'youtube',
	initialState: {
		data: [],
		isLoading: false,
	},
	extraReducers: {
		[fetchYoutube.pending]: (state) => {
			state.isLoading = true;
		},
		[fetchYoutube.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.data = action.payload;
		},
		[fetchYoutube.rejected]: (state, action) => {
			state.isLoading = false;
			state.data = action.payload;
		},
	},
});

export default youtubeSlice.reducer;
