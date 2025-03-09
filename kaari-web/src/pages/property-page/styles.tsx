import styled from "styled-components";
import { Theme } from "../../theme/theme";

interface PropertyPageProps {
    isFixed: boolean;
    isStopped: boolean;
    stopPosition: number;
}

export const PropertyPage = styled.div<PropertyPageProps>`
  display: flex;
  justify-content: space-between;
  min-height: 200vh;
  position: relative;


  * {
    transition: all 0.3s ease;
  }

  .main-content {
    padding: 20px;
    padding-top: 120px;
    width: 100%;
    padding-right: 475px;
    
    
    z-index: -1;

    @media (max-width: 1400px) {
      padding-right: calc(33.3% + 20px);
    }
  }

  .slider {
    width: 100%;
    height: 100%;
    background-color: ${Theme.colors.primary};

  }

  .checkout-box {
    max-width: 455px;
    width: 33.3%;
    min-height: calc(100vh);
    padding: 80px 20px;
    background: ${Theme.colors.gray2};
    display: flex;
    align-items: end;
    z-index: -1;
  }

  .checkout-box.fixed {
    position: fixed;
    top: 0px;
    right: 0px;
  }

  .checkout-box.stopped {
    position: absolute;
    bottom: calc(100vh - ${(props) => props.stopPosition}px);
    right: 0px;
  }

  .stop-point {
    position: absolute;
    bottom: 10%;
    width: 100%;

  }
`;