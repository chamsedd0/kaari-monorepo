//read more button
import ButtonBaseModel2 from "../../styles/buttons/button-base-modal-style-variant-2"

export default function ButtonVariant2({ text, style, _white }: { text: string, style?: React.CSSProperties, _white?: boolean }) {
    return (
        <ButtonBaseModel2 style={style} _white={_white}>
            {text}
        </ButtonBaseModel2>

    )
}