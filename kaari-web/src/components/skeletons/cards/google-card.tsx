import { CardBaseModelStyleGoogle } from "../../styles/cards/card-base-model-style-google";
import WhiteButtonVariant3_1 from "../buttons/button-variants-3/white-button-variant-3-1";
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
            <WhiteButtonVariant3_1 text="Connect to Google" icon={<img src={googleIcon} alt="Google" />} />
        </div>
    </CardBaseModelStyleGoogle>
  );
};
