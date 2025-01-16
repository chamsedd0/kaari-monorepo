import ButtonVariant1 from "../button-variant-1";

export default function BgButtonVariant1_1({ variant, text }: { variant: number, text: string}) {
    return (
        variant === 1 ? (
          <ButtonVariant1 text={text} style={{ width: '100%', maxWidth: '415px', height: '60px'}} />
        ) : (
          <ButtonVariant1 text={text} style={{ width: '100%', maxWidth: '312px', height: '60px'}} />
        )
    );
}
