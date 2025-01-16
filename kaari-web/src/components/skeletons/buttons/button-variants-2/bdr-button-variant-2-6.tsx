import { Theme } from "../../../../theme/theme";
import ButtonVariant2 from "../button-variant-2";

//search button


export default function BgButtonVariant2_6({ text, _white }: { text: string, _white: boolean}) {
    return (
        <ButtonVariant2 text={text} _white={_white} style={{ width: '100%' , maxWidth: '144px', height: '40px', font: Theme.typography.fonts.mediumB}}/>
    );
}
