import { Theme } from "../../../../theme/theme";
import ButtonVariant1 from "../button-variant-1";

export default function BgButtonVariant1_7({ text }: { text: string}) {
    return (
        <ButtonVariant1 text={text}  style={{ maxWidth: '100px', height: '32px', padding: '10px', font: Theme.typography.fonts.smallM}}/>
    );
}

