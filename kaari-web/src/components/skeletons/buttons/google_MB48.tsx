import { GoogleMB48 } from "../../styles/buttons/white_Google_MB48_style";


export const GoogleButtonMB48 = ({ text, icon }: { text: String, icon?: String}) => {
  return (
    <GoogleMB48>
        {icon}
        {text}
    </GoogleMB48>
  )
}