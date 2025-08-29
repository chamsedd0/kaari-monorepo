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
    width: 100%;
    display: flex;
    align-items: center;
    height: auto;
    padding: 12px 16px;


    .timer {
        font: normal 900 48px Visby CF;
        color: ${Theme.colors.black};
        text-align: center;
        vertical-align: center;
        margin: 0;
        letter-spacing: 1px;
    }

    @media (max-width: 900px) {
        .timer { font-size: 36px; }
    }

    @media (max-width: 640px) {
        padding: 10px 12px;
        .timer { font-size: 28px; }
    }

`