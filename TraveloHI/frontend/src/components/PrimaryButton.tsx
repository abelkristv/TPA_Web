/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react"
import { TraveloHiTheme } from "../assets/theme"

type ButtonProps = {
    content: string
}

const PrimaryButton = ({content}: ButtonProps) => {
    const theme: TraveloHiTheme = useTheme() as TraveloHiTheme
    const buttonStyle = css`
        background-color: ${theme.colors?.primary};
        color: ${theme.colors?.fonts};
        border: none;
        padding: 10px;
        border-radius: 10px;
        box-shadow: 0px 7px ${theme.colors?.primaryDarkened};
        &:hover {
            cursor: pointer;
            box-shadow: 0px 0px ${theme.colors?.primaryDarkened};
            transform: translateY(7px);
            transition: 0.2s;
        }
        &:active {
            
        }
    `
    
    return (
        <button css={buttonStyle}>
            {content}
        </button>
    )
}

export default PrimaryButton