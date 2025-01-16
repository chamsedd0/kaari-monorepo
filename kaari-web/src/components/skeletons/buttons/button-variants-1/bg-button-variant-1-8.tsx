import { Theme } from "../../../../theme/theme";
import ButtonVariant1 from "../button-variant-1";

export default function BgButtonVariant1_8({ text }: { text: string}) {
    return (
        <ButtonVariant1 text={text}  style={{ width: '144px', height: '40px', padding: '12px', font: Theme.typography.fonts.largeB}}/>
    );
}
