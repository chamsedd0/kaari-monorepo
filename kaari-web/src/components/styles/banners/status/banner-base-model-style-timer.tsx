import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';


export const BannerBaseModelStyleTimer = styled.div`

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.4); 
    backdrop-filter: blur(10px);
    border-radius: ${Theme.borders.radius.lg};
    max-width: 100%;
    height: 72px;
    padding: 16px;


    .timer {
        font: normal 900 58px Visby CF;
        color: ${Theme.colors.white};
        text-align: center;
        vertical-align: center;
        margin-top: 8px;
    }

`