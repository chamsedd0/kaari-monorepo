import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

export const CardBaseModelStyleMessages = styled.div`
   display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    background-color: ${Theme.colors.white};
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.md};
    padding: 16px;
    width: 100%;

    .title-viewmore-container{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        
        .title{
        font: ${Theme.typography.fonts.extraLargeB};
        color: ${Theme.colors.black};
    }

    .viewmore{ 
        font: ${Theme.typography.fonts.mediumB};
        color: ${Theme.colors.secondary};
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            color: ${Theme.colors.primary};
        }
    }
    }

    .chat-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        width: 100%;

        .chat-box{
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            width: 100%;
            border-radius: ${Theme.borders.radius.md};
            background-color: ${Theme.colors.white};
            border: ${Theme.borders.primary};

            .profile-picture{
                width: 60px;
                height: 60px;
                border-radius: ${Theme.borders.radius.round};
                object-fit: cover;
            }

            .text-container{
                display: flex;
                flex-direction: column;
                gap: 7px;
                align-items: start;
                
                .name{
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.black};
                }

                .message{
                    font: ${Theme.typography.fonts.text12};
                    color: ${Theme.colors.gray2};
                }
            }
            
            .end-container{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: end;
                height: 100%;
                margin-left: auto;
                
                .icon{
                    width: 14px;
                    height: 14px;
                    color: ${Theme.colors.black};
                    cursor: pointer;
                transition: all 0.3s ease;

                   
                }

                .details{
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.secondary};
                    cursor: pointer;
                    transition: all 0.3s ease;

                    &:hover {
                        color: ${Theme.colors.primary};
                    }
                }
            }
        }
    }
`;