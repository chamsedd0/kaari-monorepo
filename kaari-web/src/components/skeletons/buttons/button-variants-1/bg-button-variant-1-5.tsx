
import { Theme } from "../../../../theme/theme";
import ButtonVariant1 from "../button-variant-1";

//search button


export default function BgButtonVariant1_5({ text }: { text: string}) {
    return (
        <ButtonVariant1 text={text}  style={{ width: '100%' , maxWidth: '415px', height: '48px', padding: '17px', font: Theme.typography.fonts.mediumB}}/>
    );
}
