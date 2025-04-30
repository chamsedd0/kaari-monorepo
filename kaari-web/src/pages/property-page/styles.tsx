import styled, { keyframes } from "styled-components";
import { Theme } from "../../theme/theme";

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface PropertyPageProps {
  total_Height: number;
  isFixed: boolean;
  isStopped: boolean;
  stopPosition: number;
}

export const PropertyPage = styled.div<PropertyPageProps>`
  display: flex;
  position: relative;
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  flex-direction: column;

  * {
    transition: all 0.3s ease;
  }

  .main-content {
    padding: 20px;
    width: 100%;
    padding-right: 475px;
    padding-bottom: 66px;
    margin-top: 125px;
    
    
    z-index: 0;

    @media (max-width: 1400px) {
      padding-right: calc(33.3% + 20px);
  }

  .photo-slider {
    width: 100%;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 40px;
    }

    .property-info {
      display: flex;
      flex-direction: column;
      gap: 40px;

      .title {
        color: ${Theme.colors.black};
        font: ${Theme.typography.fonts.h4B};
      }

      .description {
        color: ${Theme.colors.gray2};
        font: ${Theme.typography.fonts.text16};
        line-height: 150%;
      }

      .money-safe-banner {
        background: ${Theme.colors.primary};
        padding: 24px 20px;
        border-radius: ${Theme.borders.radius.lg};
        color: ${Theme.colors.white};

        h3 {
          font: ${Theme.typography.fonts.h4B};
          margin-bottom: 13px;
        }

        p {
          font: ${Theme.typography.fonts.text16};
          margin-bottom: 22px;
          max-width: 70%;
          line-height: 150%;
        }

        .outside-tube {
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${Theme.colors.quaternary};
          border-radius: ${Theme.borders.radius.extreme};
          padding: 1px 0px;
          margin-bottom: 10px;

          .inside-tube {
            
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.white};
            padding: 12px 16px;
            background: ${Theme.colors.secondary};
            width: 60%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: ${Theme.borders.radius.extreme};
          }
          
        }

        .timeline {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }

      .equipment {
        h2 {
          font: ${Theme.typography.fonts.h4B};
          color: ${Theme.colors.black};
          margin-bottom: 40px;
        }

        .equipment-list {
          display: flex;
          flex-direction: column;
          gap: 32px;

          .equipment-group {
            width: 100%;

            h3 {
              font: ${Theme.typography.fonts.extraLargeB};
              color: ${Theme.colors.black};
              margin-bottom: 32px;
            }

            ul {
              list-style: none;
              padding: 0;
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 24px;

              li {
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.gray2};
                display: flex;
                align-items: center;
                position: relative;
                padding-left: 28px;

                &:before {
                  content: '';
                  position: absolute;
                  left: 0;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background-color: ${Theme.colors.secondary};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }

                img {
                  position: absolute;
                  left: 4px;
                  top: 50%;
                  transform: translateY(-50%);
                  width: 12px;
                  height: 12px;
                  z-index: 1;
                  filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
                }

                &.unavailable {
                  &:before {
                    background-color: ${Theme.colors.primary};
                  }
                }
              }
            }
          }
        }
      }

      .rooms {
        h2 {
          font: ${Theme.typography.fonts.h4B};
          color: ${Theme.colors.black};
          margin-bottom: 24px;
        }

        .room-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;

          .room {
            height: 100px;
            padding: 16px;
            border: 1px solid ${Theme.colors.tertiary};
            border-radius: ${Theme.borders.radius.md};
            display: flex;
            align-items: center;
            gap: 12px;
            
           
            .text-container {
              display: flex;
              flex-direction: column;
              gap: 6px;
              
              .room-name {
                font: ${Theme.typography.fonts.largeB};
                color: ${Theme.colors.black};
              }

              .room-description {
                font: ${Theme.typography.fonts.smallM};
                color: ${Theme.colors.gray2};
              }
            }

            img {
              width: 40px;
              height: 40px;
              object-fit: contain;
              display: block;

            }
          }
        }
      }

      .rental-conditions {
        h2 {
          font: ${Theme.typography.fonts.h4B};
          color: ${Theme.colors.black};
          margin-bottom: 24px;
        }

        .conditions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 24px;

          .condition {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .label {
              font: ${Theme.typography.fonts.largeB};
              color: ${Theme.colors.black};
            }

            .value {
              font: ${Theme.typography.fonts.largeM};
              color: ${Theme.colors.gray2};
            }
          }
        }
      }

      .about-advertiser {
        h2 {
          font: ${Theme.typography.fonts.h4B};
          color: ${Theme.colors.black};
          margin-bottom: 24px;
        }

        .advertiser-info {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;

          .advertiser-image {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            object-fit: cover;
          }

          .advertiser-details {
            h3 {
              font: ${Theme.typography.fonts.h4B};
              color: ${Theme.colors.black};
            }

            p {
              font: ${Theme.typography.fonts.largeM};
              color: ${Theme.colors.gray2};
              margin: 4px 0 12px;
            }


          }
        }

        .advertiser-description, .property-description {
          font: ${Theme.typography.fonts.text16};
          color: ${Theme.colors.gray2};
          line-height: 150%;
          margin-bottom: 16px;
        }
      }

      .location {
        h2 {
          font: ${Theme.typography.fonts.h4B};
          color: ${Theme.colors.black};
          margin-bottom: 24px;
        }

        .nearby-places {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;

          .place {
            h4 {
              font: ${Theme.typography.fonts.largeB};
              color: ${Theme.colors.black};
              margin-bottom: 4px;
            }

            span {
              font: ${Theme.typography.fonts.largeM};
              color: ${Theme.colors.gray2};
            }
          }
        }
      }
    }
  }

  .stop-reference {
    width: 100%;
    height: 1px;
    position: relative;
    z-index: -1;
    margin-bottom: 40px;
  }

  .bottom-content {
    width: 100%;
    padding: 20px;
    padding-top: 0px;


    .map-image {
      width: 100%;
      height: auto;
      border-radius: ${Theme.borders.radius.md};
      margin-bottom: 40px;
    }

    .recommendations {
      .title {
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
        margin-bottom: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .navigation-buttons {
          display: flex;
          gap: 12px;

          button {
            width: 40px;
            height: 40px;
            border-radius: ${Theme.borders.radius.md};
            border: 1px solid ${Theme.colors.tertiary};
            background: ${Theme.colors.white};
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;

            &:hover {
              background: ${Theme.colors.tertiary};
            }
          }
        }
      }

      .recommendations-list {
        display: flex;
        gap: 20px;
        overflow-x: scroll;
        padding-bottom: 20px;
        scroll-behavior: smooth;

        .recommendation {
          min-width: 445px;

          img {
            max-height: 300px;
          }
        }

        &::-webkit-scrollbar {
          display: none;
        }
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    }
  }

  .checkout-box {
    max-width: 455px;
    width: 33.3%;
    min-height: 100vh;
    height: 100vh;
    padding: 20px;
    padding-top: 0px;
    margin-top: 0px;
    background: ${Theme.colors.white};
    border: ${Theme.borders.primary};
    border-top: none;
    border-right: none;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    z-index: 10;
    transition: none;
    right: 0;
    position: absolute;
    top: 0;
    box-sizing: border-box;
  }

  .checkout-box.fixed {
    position: fixed;
    top: 0;
    right: 0;
    @media (min-width: 1760px) {
      right: calc((100vw - 1500px) / 2) !important;
    }
  }

  .checkout-box.stopped {
    position: absolute;
    right: 0;
    @media (min-width: 1760px) {
      right: 0 !important;
    }
  }

  .stop-point {
    width: 100%;
    height: 500px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .certification-banner {
    max-width: 134px;
  }

  .property-icons-container {
    display: flex;
    align-items: center;
    gap: 80px;
    margin-bottom: 60px;

    .icon-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .icon-circle {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: ${Theme.colors.secondary};

        img {
          padding: 16px;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .icon-text {
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.black};
      }
      
      
    }
    
  }

`;