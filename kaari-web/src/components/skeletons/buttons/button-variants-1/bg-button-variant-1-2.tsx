import { Theme } from "../../../../theme/theme";
import ButtonVariant1 from "../button-variant-1";

//search button


export default function BgButtonVariant1_2({ text }: { text: string}) {
    return (
        <ButtonVariant1 text={text} style={{ width: '100%' , maxWidth: '227px', height: '70px', font: Theme.typography.fonts.h4B}}/>
    );
}
