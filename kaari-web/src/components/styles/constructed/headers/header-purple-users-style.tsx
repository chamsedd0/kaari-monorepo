import styled from "styled-components";
import { Theme } from "../../../../theme/theme";
import { HeaderBaseModel } from "./header-base-model";



export const HeaderPurpleUsers = styled(HeaderBaseModel)`
    background-color: ${Theme.colors.primary};
    border: none !important;

    .link {
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.white};
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            opacity: 0.8;
        }
    }

    .profilePic {
        img {
            height: 40px;
        }
    }

    .favorites svg {
        height: 21px;
        margin-top: 3px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            opacity: 0.8;
        }
    }

`