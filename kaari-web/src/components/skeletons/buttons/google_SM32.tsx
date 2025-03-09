import { GoogleSM32 } from "../../styles/buttons/white_Google_SM32_style"

export const GoogleButtonSM32 = ({ text, icon }: { text: String, icon?: String}) => {
  return (
    <GoogleSM32>
        {icon}
        {text}
    </GoogleSM32>
  )
}