import { WhatsappButtonStyle } from '../../styles/buttons/whatsapp-button-style';




export const WhatsappButton =({text, icon}: {text: String, icon?: string}) => {
  return (
    <WhatsappButtonStyle>
     
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img className='icon' src={icon} alt="icon" />
        {text}
      </div>
    </WhatsappButtonStyle>
  );
};
