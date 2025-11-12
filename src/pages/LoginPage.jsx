// 프론트엔드/src/LoginPage.jsx 파일

import React from 'react';
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// .env 파일에서 변수를 로드합니다.
const VITE_API_BASE_URL=import.meta.env.VITE_API_BASE_URL;
const VITE_GOOGLE_CLIENT_ID=import.meta.env.VITE_GOOGLE_CLIENT_ID;

function LoginPage({ onLoginSuccess }){
    const navigate=useNavigate();

    const handleGoogleLoginSuccess=async(credentialResponse)=>{
        const googleIdToken=credentialResponse.credential;
        console.log("Google로부터 id_token을 받았습니다.",googleIdToken);

        try{
            const response=await axios.post(
                `${VITE_API_BASE_URL}/api/auth/google/verify`,
                {
                    id_token: googleIdToken
                }
            );
            const appAccessToken=response.data.access_token;

            console.log("백엔드로부터 토큰을 받았습니다!",appAccessToken);
            console.log("사용자 정보: ",response.data.user);
            localStorage.setItem('myAppToken',appAccessToken);
            if(onLoginSuccess){
                onLoginSuccess();
            }

            //TODO: 로그인 성공 후 메인 페이지 이동
            navigate('/home');
        }
        catch(error){
            console.error("백엔드 토큰 검증 실패 :",error);
            //TODO:로그인 실패 알림
        }
    };

    return (
        <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
        <div style={{ padding:'20px', textAlign: 'center'}}>
            <h2>로그인</h2>
            <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={()=>{
                    console.log('Google 로그인 실패');
                    //TOdo 로그인 실패 알림
                }}
                />
        </div>
        </GoogleOAuthProvider>
    )
}
export default LoginPage;