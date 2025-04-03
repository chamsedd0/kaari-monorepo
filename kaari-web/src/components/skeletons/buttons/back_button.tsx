import React from 'react';
import { BackButtonStyle } from "../../styles/buttons/back_button_style";

export const BackButton = ({ onClick }: { onClick?: () => void }) => {
    return (
        <BackButtonStyle onClick={onClick}>
            Back
        </BackButtonStyle>
    )
} 