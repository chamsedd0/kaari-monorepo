import { Theme } from "../../../../theme/theme";
import { CertifiedBanner } from "../../../styles/banners/static/certification-banner-style"
import { VerifiedIcon } from "../../icons/Icon_Verified";

export const CertificationBanner = ({purple, text}: {purple?: boolean, text: string}) => {
    return (
        <CertifiedBanner variant={purple}>
            <div className="text">{text}</div>
            <VerifiedIcon bgColor={purple ? Theme.colors.white : Theme.colors.secondary}></VerifiedIcon>
        </CertifiedBanner>
    );
}