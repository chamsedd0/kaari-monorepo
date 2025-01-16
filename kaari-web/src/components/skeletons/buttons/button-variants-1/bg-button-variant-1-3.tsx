import { Theme } from "../../../../theme/theme";
import ButtonVariant1 from "../button-variant-1";

//search button


export default function BgButtonVariant1_3({ text, variant }: { text: string, variant: number}) {
    return (
        variant === 1 ? (
            <ButtonVariant1 text={text}  style={{ width: '100%' , maxWidth: '188px', height: '48px', padding: '17px', font: Theme.typography.fonts.mediumB}}/>
        ) : (
            <ButtonVariant1 text={text}  style={{ width: '100%' , maxWidth: '188px', height: '42px', padding: '15px', font: Theme.typography.fonts.smallB}}/>
        )
    );
}

