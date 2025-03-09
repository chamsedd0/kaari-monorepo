import styled from "styled-components";
import { Theme } from "../../../../theme/theme";
import { HeaderBaseModel } from "./header-base-model";



export const HeaderWhiteUsers = styled(HeaderBaseModel)`
    background-color: ${Theme.colors.white};

    .link {
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.primary};
        cursor: pointer;
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
    }

`