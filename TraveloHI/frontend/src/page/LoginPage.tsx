/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import { TraveloHiTheme, beachDayBg, beachNightBg, dayTheme, traveloHINightLogo, traveloHiDayLogo } from "../assets/theme";
import PrimaryButton from "../components/PrimaryButton";
import { FormEvent, useState } from "react";
import axios from "axios";


const LoginPage = () => {
    const theme: TraveloHiTheme = useTheme() as TraveloHiTheme
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const loginData = {
            email: email,
            password: password
        }

        console.log(loginData)

        try {
            const response = await axios.post('http://localhost:1234/login', loginData)
            console.log('Response: ', response.data)
            setError('')
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                // console.log("There was an error : ", error.response?.data)
                setError(error.response?.data.error)
            }    
        }
    }

    const bgStyle = css`
        background-image: url(${theme.name === dayTheme.name ? beachDayBg : beachNightBg});
        width: 100%;
        height: 100vh;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
    `

    const loginFormBoxStyle = css`
        background-color: ${theme.colors?.background};
        color: ${theme.colors?.fonts};
        box-shadow: 0px 0px 20px 0px rgba(54, 54, 54, 0.45);
        border-radius: 15px;
        &::before {
            display: block;
            border-radius: 15px 15px 0px 0px;
            content: '';
            top: 0;
            left: 0;
            width: 100%;
            height: 10px;
            margin: 0px;
            background-color: ${theme.colors?.primary};
        }
    `

    const loginFormStyle = css`
        display: flex;
        flex-direction: column;
        margin: 10px 50px 40px 50px;
        gap: 20px;
    `

    const loginFormComponent = css`
        display: flex;
        flex-direction: column;
    `

    const loginFormInput = css`
        height: 30px;
        border: 1px solid gray;
        padding: 2px;
        padding-left: 5px;
    `

    const logo = css`
        display: flex;
        align-items: center;
    `

    const errorStyle = css`
        color: red;
    `

    return (
        <div css={bgStyle}>
            <div css={loginFormBoxStyle}>
                <form action="" css={loginFormStyle} onSubmit={handleSubmit}>
                    <div className="logo" css={logo}>
                        <h1>Login</h1>
                        <img src={theme.name === dayTheme.name ? traveloHiDayLogo : traveloHINightLogo} alt="" width='70px' height='70px' />
                    </div>
                    <div className="email" css={loginFormComponent}>
                        <label htmlFor="email">Email</label>
                        <input type="text" 
                            name="email" 
                            id="email" 
                            css={loginFormInput}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="password" css={loginFormComponent}>
                        <label htmlFor="password">Password</label>
                        <input type="password" 
                            name="password" 
                            id="password" 
                            css={loginFormInput}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <p css={errorStyle}>{error}</p>
                    <PrimaryButton content="Submit"/>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;