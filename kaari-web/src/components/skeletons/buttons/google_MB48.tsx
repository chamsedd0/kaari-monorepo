import { GoogleMB48 } from "../../styles/buttons/white_Google_MB48_style";


export const GoogleButtonMB48 = ({ text, icon }: { text: string, icon?: string}) => {
  return (
    <GoogleMB48>
        {icon && <img src={icon} alt="Google icon" />}
        {text}
    </GoogleMB48>
  )
}