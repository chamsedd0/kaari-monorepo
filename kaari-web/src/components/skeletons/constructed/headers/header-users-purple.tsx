import { HeaderPurpleUsers } from '../../../styles/constructed/headers/header-purple-users-style';
import Logo from '../../icons/LogoWhite.svg'
import { HeartIcon } from "../../icons/heartIcon";
import ProfilePic from '../../../../assets/images/ProfilePicture.png'
import LanguageBanner from "../../banners/status/banner-base-model-language";
import { Theme } from "../../../../theme/theme";

import { House } from '../../icons/HouseIcon';
import { Notifications } from '../../icons/NotificationsIcon';
import { MessageBubble } from '../../icons/messageBubbleIcon';


export const PurpleHeaderUsers = ({user = false}: {user?: boolean}) => {
    return(
        <div>
            {user ? (
                    <HeaderPurpleUsers>
                        <div className="wrapper">
                        <div className="logo">
                            <img src={Logo} alt="" />
                        </div>
                        
                        <div className="nav-links">
                            <div className="link">Help</div>
                            <LanguageBanner text="ENG"></LanguageBanner>

                            <div className="favorites">
                                <House bgColor={Theme.colors.white}></House>
                            </div>

                            <div className="favorites">
                                <MessageBubble bgColor={Theme.colors.white}></MessageBubble>
                            </div>
                            
                            <div className="favorites">
                                <Notifications bgColor={Theme.colors.white}></Notifications>
                            </div>

                            <div className="favorites">
                                <HeartIcon bgColor={Theme.colors.white}></HeartIcon>
                            </div>
                            

                            <div className="profilePic">
                                <img src={ProfilePic} alt="" />
                            </div>
                        </div>
                        </div>
                    </HeaderPurpleUsers>
                    
                ) : (
                    <HeaderPurpleUsers>
                        <div className="wrapper">
                        <div className="logo">
                            <img src={Logo} alt="" />
                        </div>
                        <div className="nav-links">
                            <div className="link">Are you a landlord?</div>
                            <LanguageBanner text="ENG"></LanguageBanner>
                            <div className="favorites">
                                <HeartIcon bgColor={Theme.colors.white}></HeartIcon>
                            </div>
                            <div className="link">Help</div>
                            <div className="link">
                                Sign in
                            </div>
                        </div>
                        </div>
                    </HeaderPurpleUsers>
                )}
        </div>
    )
}