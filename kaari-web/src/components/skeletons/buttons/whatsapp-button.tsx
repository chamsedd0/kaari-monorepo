import { ReactElement } from "react";
import { WhatsappButtonStyle } from '../../styles/buttons/whatsapp-button-style';




export const WhatsappButton =({text, icon}: {text: String, icon?: ReactElement<any, any>}) => {
  return (
    <WhatsappButtonStyle>
     
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon}{text}
      </div>
    </WhatsappButtonStyle>
  );
};
