import styled from "styled-components";
import { FormBaseModel } from "./form-base-model-style";

export const FormBaseModelVariant1 = styled(FormBaseModel)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    max-width: 870px;
    width: 100%;



    @media (max-width: 1024px) {
        flex-direction: column;
        gap: 24px;
        max-width: 80%;
    }
`;