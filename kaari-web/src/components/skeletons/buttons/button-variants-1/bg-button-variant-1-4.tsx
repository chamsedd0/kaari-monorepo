import { Theme } from "../../../../theme/theme";
import ButtonVariant1 from "../button-variant-1";

//search button


export default function BgButtonVariant1_4({ text, variant }: { text: string, variant: number}) {
    return (
        variant === 1 ?
        <ButtonVariant1 text={text}  style={{ width: '100%', maxWidth: '188px', height: '60px', font: Theme.typography.fonts.largeB}}/>
        :
        <ButtonVariant1 text={text} hover={true} style={{ width: '100%' , maxWidth: '188px', height: '60px', font: Theme.typography.fonts.largeB}}/>
    );
}
