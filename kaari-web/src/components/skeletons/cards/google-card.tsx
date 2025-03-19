import { CardBaseModelStyleGoogle } from "../../styles/cards/card-base-model-style-google";
import { GoogleButtonSM32 } from "../buttons/google_SM32";
import googleIcon from "../icons/google-icon.svg";


export const GoogleCard = ({title, description}: {title: string, description: string}) => {
  return (
    <CardBaseModelStyleGoogle>
        <div className="title">
            {title}
        </div>
        <div className="description">
            {description}
        </div>
        <div className="button">
            <GoogleButtonSM32 text="Connect to Google" icon={<img src={googleIcon} alt="Google" />} />
        </div>
    </CardBaseModelStyleGoogle>
  );
};
