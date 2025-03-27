import styled from "styled-components";


export const DashboardPageStyle = styled.div`
     display: flex;
    width: 100%;
    gap: 40px;

    .right {
        display: flex;
        flex-direction: column;
        flex: 0.35;
        gap: 24px;
    }

    .left {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 24px;
    }
`;