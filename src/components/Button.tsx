import { ButtonHTMLAttributes } from "react"
import '../styles/button.scss'

type buttonprops = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?:  boolean
}

export function Button({isOutlined = false, ...props}: buttonprops){
    return (
        <button className={`button ${isOutlined ? 'outlined' : ''}`}
        {...props}
        />
    )
}
