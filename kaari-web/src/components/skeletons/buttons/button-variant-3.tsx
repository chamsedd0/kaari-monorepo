//read more button
import ButtonBaseModel3 from "../../styles/buttons/button-base-modal-style-variant-3"

export default function ButtonVariant3({ text, style, icon, variant }: { text: string, style?: React.CSSProperties, icon?: React.ReactNode, variant?: boolean}) {
    return (
        <ButtonBaseModel3 style={style} variant={variant}>
            {icon}
            {text}
        </ButtonBaseModel3>

    )
}