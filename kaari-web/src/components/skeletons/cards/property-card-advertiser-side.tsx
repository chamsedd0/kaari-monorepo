
import propertyExamplePic from "../../../assets/images/propertyExamplePic.png";
import { CardBaseModelStyle2 } from "../../styles/cards/card-base-model-style-2";
import BgButtonVariant1_8 from "../buttons/button-variants-1/bg-button-variant-1-8";
import BdrButtonVariant2_5 from "../buttons/button-variants-2/bdr-button-variant-2-5";

export const PropertyCardAdvertiserSide = ({title, subtitle, description}: {title: string, subtitle: string, description: string}) => {
  return (
    <CardBaseModelStyle2>
        <img src={propertyExamplePic} alt="Property" />
        <div className="title">
            <b>{title}</b> 
            <span> {subtitle}</span>
        </div>  


        <div className="description">
            {description}
        </div>

        <div className="control">
            <BdrButtonVariant2_5 text="Unlist" />
            <BgButtonVariant1_8 text="Ask for Edit" />
        </div>

    </CardBaseModelStyle2>
  );
};
