import { Theme } from "../../../../theme/theme";
import ButtonVariant2 from "../button-variant-2";

//search button


export default function BgButtonVariant2_3({ text }: { text: string}) {
    return (
        <ButtonVariant2 text={text} style={{ width: '100%' , maxWidth: '261px', height: '40px', font: Theme.typography.fonts.mediumB}}/>
    );
}
