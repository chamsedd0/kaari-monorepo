import { GoogleSM32 } from "../../styles/buttons/white_Google_SM32_style"
import { ReactNode } from "react"

export const GoogleButtonSM32 = ({ text, icon, onClick }: { text: String, icon?: ReactNode, onClick?: () => void }) => {
  return (
    <GoogleSM32 onClick={onClick}>
        {icon}
        {text}
    </GoogleSM32>
  )
}