import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const PhotoSliderStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    margin: 0 auto;

    .main-image-container {
        position: relative;
        width: 100%;
        /* Maintain 872:390 aspect ratio */
        aspect-ratio: 872/390;
        border-radius: ${Theme.borders.radius.md};
        overflow: hidden;

        .main-image-wrapper {
            position: relative;
            width: 100%;
            height: 100%;

            .main-image {
                position: absolute;
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                pointer-events: none;

                &.active {
                    opacity: 1;
                    z-index: 1;
                    pointer-events: auto;
                }
            }
            
            /* Video container styles */
            .video-container {
                position: absolute;
                width: 100%;
                height: 100%;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                pointer-events: none;
                
                &.active {
                    opacity: 1;
                    z-index: 1;
                    pointer-events: auto;
                }
                
                .main-video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }

        .nav-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            border-radius: ${Theme.borders.radius.round};
            background: ${Theme.colors.white};
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            opacity: 0.3;
            justify-content: center;
            z-index: 2;
            transition: all 0.3s ease;

            &:hover {
                opacity: 0.6;
                background: ${Theme.colors.white};
            }

            &.prev {
                left: 15px;
                padding-right: 2px;
            }

            &.next {
                right: 15px;
                padding-left: 2px;
            }
        }
    }

    .thumbnails-container {
        display: flex;
        gap: 20px;
        width: 100%;
        overflow-x: auto;
        cursor: grab;
        user-select: none;
        padding-bottom: 4px;

        &:active {
            cursor: grabbing;
        }

        &::-webkit-scrollbar {
            display: none;
        }
        -ms-overflow-style: none;
        scrollbar-width: none;

        .thumbnail {
            width: calc((100% - 60px) / 4);
            max-width: 203px;
            /* Maintain 203:185 aspect ratio */
            aspect-ratio: 203/185;
            object-fit: cover;
            border-radius: ${Theme.borders.radius.md};
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0.7;
            flex-shrink: 0;
            user-select: none;
            -webkit-user-drag: none;

            &.active {
                opacity: 1;
            }

            &:hover {
                opacity: 1;
            }
        }
        
        /* Video thumbnail container */
        .thumbnail-container {
            width: calc((100% - 60px) / 4);
            max-width: 203px;
            aspect-ratio: 203/185;
            flex-shrink: 0;
            position: relative;
            border-radius: ${Theme.borders.radius.md};
            overflow: hidden;
            opacity: 0.7;
            transition: all 0.3s ease;
            
            &.active {
                opacity: 1;
            }
            
            &:hover {
                opacity: 1;
            }
            
            .video-thumbnail {
                position: relative;
                width: 100%;
                height: 100%;
                
                .play-icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 48px;
                    height: 48px;
                    background-color: rgba(0, 0, 0, 0.5);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1;
                    
                    svg {
                        width: 24px;
                        height: 24px;
                    }
                }
                
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
    }
`;

