import { GoogleMB48 } from "../../styles/buttons/white_Google_MB48_style";


export const GoogleButtonMB48 = ({ text, icon, onClick }: { text: string, icon?: string, onClick?: () => void }) => {
  return (
    <GoogleMB48 onClick={onClick}>
        {icon && <img src={icon} alt="Google icon" />}
        {text}
    </GoogleMB48>
  )
}