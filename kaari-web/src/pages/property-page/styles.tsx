import styled from "styled-components";
import { Theme } from "../../theme/theme";

interface PropertyPageProps {
    isFixed: boolean;
    isStopped: boolean;
    stopPosition: number;
    total_Height: number;
}

export const PropertyPage = styled.div<PropertyPageProps>`
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;
  max-width: 1600px;
  margin: auto;
  display: flex;
  align-items: start;
  justify-content: start;
  flex-direction: column;



  * {
    transition: all 0.3s ease;
  }

  .main-content {
    padding: 20px;
    margin-top: 80px;
    width: 100%;
    padding-right: 475px;
    
    
    
    z-index: 0;

    @media (max-width: 1400px) {
      padding-right: calc(33.3% + 20px);
    }
  }

  .photo-slider {
    width: 100%;
    height: 2000px;
    background-color: gray;
  }

  .checkout-box {
    max-width: 455px;
    width: 33.3%;
    min-height: calc(100vh);
    padding: 80px 20px;
    padding-top: 108px;
    background: ${Theme.colors.white};
    border: ${Theme.borders.primary};
    border-top: none;
    border-right: none;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
  }

  .checkout-box.fixed {
    position: fixed;
    top: 0px;
    right: 0px;
    
    @media (min-width: 1760px) {
      right: calc(100vw - 1600px - 160px);
    }
  }

  .checkout-box.stopped {
    position: absolute;
    bottom: calc(${(props) => props.total_Height}px - ${(props) => props.stopPosition}px);
    right: 0px;


  }

  .stop-point {
    width: 100%;
    height: 1000px;

  }
`;