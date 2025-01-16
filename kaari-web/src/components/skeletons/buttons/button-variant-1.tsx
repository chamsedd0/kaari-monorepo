

//read more button

import ButtonBaseModel1 from "../../styles/buttons/button-base-model-style-variant-1";

export default function ButtonVariant1({ text, style, hover }: { text: string, style?: React.CSSProperties, hover?: boolean }) {
    return (
        <ButtonBaseModel1 hoverSecondary={hover} style={style}>
            {text}
        </ButtonBaseModel1>

    )
}

