import styled from "styled-components";

export const ReservationsStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    gap: 32px;
    width: 100%;

    .pending-requests {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 32px;

        .request-card {
            flex: 1;
            height: 290px;
        }
    }
`
