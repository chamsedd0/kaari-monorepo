import styled from 'styled-components';
import { Theme } from '../../../../../theme/theme';

export const WriteReviewPageStyle = styled.div`
    display: flex;
    gap: 24px;
    
    .left {
        flex: 2;
        
        .top-section {
            margin-bottom: 24px;
            
            .page-title {
                font: ${Theme.typography.fonts.h2};
                color: ${Theme.colors.black};
                margin-bottom: 8px;
            }
            
            .property-title {
                font: ${Theme.typography.fonts.h4};
                color: ${Theme.colors.gray1};
                margin-bottom: 16px;
            }
        }
        
        .loading, .error, .success {
            padding: 24px;
            background: ${Theme.colors.white};
            border-radius: ${Theme.borders.radius.md};
            border: ${Theme.borders.primary};
            margin-bottom: 24px;
            text-align: center;
        }
        
        .error {
            color: ${Theme.colors.error};
        }
        
        .success {
            color: ${Theme.colors.success};
            
            h3 {
                font: ${Theme.typography.fonts.h4B};
                margin-bottom: 16px;
            }
            
            p {
                font: ${Theme.typography.fonts.text16};
                margin-bottom: 8px;
            }
        }
        
        .review-form {
            padding: 24px;
            background: ${Theme.colors.white};
            border-radius: ${Theme.borders.radius.md};
            border: ${Theme.borders.primary};
            
            .form-section {
                margin-bottom: 24px;
                
                label {
                    display: block;
                    font: ${Theme.typography.fonts.text16B};
                    color: ${Theme.colors.black};
                    margin-bottom: 8px;
                }
                
                .text-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid ${Theme.colors.gray5};
                    border-radius: ${Theme.borders.radius.sm};
                    font: ${Theme.typography.fonts.text16};
                    color: ${Theme.colors.black};
                    
                    &:focus {
                        outline: none;
                        border-color: ${Theme.colors.primary};
                    }
                }
                
                .text-area {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid ${Theme.colors.gray5};
                    border-radius: ${Theme.borders.radius.sm};
                    font: ${Theme.typography.fonts.text16};
                    color: ${Theme.colors.black};
                    resize: vertical;
                    min-height: 120px;
                    
                    &:focus {
                        outline: none;
                        border-color: ${Theme.colors.primary};
                    }
                }
            }
            
            .ratings-section {
                h3 {
                    font: ${Theme.typography.fonts.h5B};
                    color: ${Theme.colors.black};
                    margin-bottom: 16px;
                }
                
                .rating-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    
                    .rating-label {
                        font: ${Theme.typography.fonts.text16};
                        color: ${Theme.colors.black};
                    }
                }
            }
            
            .form-error {
                padding: 12px 16px;
                background: ${Theme.colors.errorLight};
                color: ${Theme.colors.error};
                border-radius: ${Theme.borders.radius.sm};
                font: ${Theme.typography.fonts.text14};
                margin-bottom: 24px;
            }
            
            .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 16px;
            }
        }
    }
    
    .right {
        flex: 1;
        
        .property-card {
            padding: 16px;
            background: ${Theme.colors.white};
            border-radius: ${Theme.borders.radius.md};
            border: ${Theme.borders.primary};
            margin-bottom: 24px;
            
            .property-image {
                width: 100%;
                height: 180px;
                object-fit: cover;
                border-radius: ${Theme.borders.radius.sm};
                margin-bottom: 16px;
            }
            
            .property-info {
                h3 {
                    font: ${Theme.typography.fonts.h5B};
                    color: ${Theme.colors.black};
                    margin-bottom: 8px;
                }
                
                p {
                    font: ${Theme.typography.fonts.text14};
                    color: ${Theme.colors.gray2};
                    margin-bottom: 12px;
                }
                
                .advertiser-info {
                    font: ${Theme.typography.fonts.text14};
                    color: ${Theme.colors.gray2};
                    
                    strong {
                        color: ${Theme.colors.primary};
                    }
                }
            }
        }
    }
`; 