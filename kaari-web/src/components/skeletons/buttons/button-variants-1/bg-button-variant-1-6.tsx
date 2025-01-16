
import { Theme } from "../../../../theme/theme";
import ButtonVariant1 from "../button-variant-1";

//search button


export default function BgButtonVariant1_6({ text }: { text: string}) {
    return (
        <ButtonVariant1 text={text}  style={{ width: '100%' , maxWidth: '261px', height: '40px', padding: '13px', font: Theme.typography.fonts.mediumB}}/>
    );
}
