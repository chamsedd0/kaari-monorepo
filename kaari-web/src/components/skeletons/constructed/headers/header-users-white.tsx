import { HeaderWhiteUsers } from "../../../styles/constructed/headers/header-white-users-style";
import Logo from '../../../../assets/images/purpleLogo.svg'
import { HeartIcon } from "../../icons/heartIcon";
import ProfilePic from '../../../../assets/images/ProfilePicture.png'
import LanguageBanner from "../../banners/status/banner-base-model-language";
import { Theme } from "../../../../theme/theme";
import { Notifications } from "../../icons/NotificationsIcon";
import { MessageBubble } from "../../icons/messageBubbleIcon";
import { House } from "../../icons/HouseIcon";

export const WhiteHeaderUsers = ({user}: {user: boolean}) => {
    return(
        <div>
            {user ? (
                    <HeaderWhiteUsers>
                        <div className="wrapper">
                        <div className="logo">
                            <img src={Logo} alt="" />
                        </div>
                        
                        <div className="nav-links">
                            <div className="link">Help</div>
                            <LanguageBanner text="ENG"></LanguageBanner>

                            <div className="favorites">
                                <House bgColor={Theme.colors.primary}></House>
                            </div>

                            <div className="favorites">
                                <MessageBubble bgColor={Theme.colors.primary}></MessageBubble>
                            </div>
                            
                            <div className="favorites">
                                <Notifications bgColor={Theme.colors.primary}></Notifications>
                            </div>

                            <div className="favorites">
                                <HeartIcon bgColor={Theme.colors.primary}></HeartIcon>
                            </div>
                            

                            <div className="profilePic">
                                <img src={ProfilePic} alt="" />
                            </div>
                        </div>
                        </div>
                    </HeaderWhiteUsers>
                    
                ) : (
                    <HeaderWhiteUsers>
                        <div className="wrapper">
                            <div className="logo">
                                <img src={Logo} alt="" />
                            </div>
                            <div className="nav-links">
                                <div className="link">Are you a landlord?</div>
                                <LanguageBanner text="ENG"></LanguageBanner>
                                <div className="favorites">
                                    <HeartIcon bgColor={Theme.colors.primary}></HeartIcon>
                                </div>
                                <div className="link">Help</div>
                                <div className="link">
                                    Sign in
                                </div>
                            </div>
                        </div>
                    </HeaderWhiteUsers>
                )}
        </div>
                
            
        
    )
}