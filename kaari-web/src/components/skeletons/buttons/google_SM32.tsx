import { GoogleSM32 } from "../../styles/buttons/white_Google_SM32_style"
import { ReactNode } from "react"

export const GoogleButtonSM32 = ({ text, icon }: { text: String, icon?: ReactNode }) => {
  return (
    <GoogleSM32>
        {icon}
        {text}
    </GoogleSM32>
  )
}