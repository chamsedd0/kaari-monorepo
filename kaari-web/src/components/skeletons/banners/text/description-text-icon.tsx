import DescriptionText from "../../../styles/banners/text/description-text-icon-style";




export default function DescriptionText_Icon({icon, text}: {icon: string, text: string}) {
    return(
        <DescriptionText>

            <img src={icon} alt="icon"></img>
            <div className="text">
                {text}
            </div>

        </DescriptionText>
    )
};