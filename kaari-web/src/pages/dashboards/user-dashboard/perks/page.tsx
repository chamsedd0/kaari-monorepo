import React from 'react';
import { PerksPageStyle } from './styles';
import { WhiteButtonSM32 } from '../../../../components/skeletons/buttons/white_SM32';
import PerkBird from '../../../../components/skeletons/icons/perkBird.svg';

const PerksPage: React.FC = () => {
    // This would typically come from an API
    const perksList = [
        { id: 1, text: 'KAARI40 for 50% off one year of Yearly or Forever' },
        { id: 2, text: 'KAARI40 for 50% off one year of Yearly or Forever' },
        { id: 3, text: 'KAARI40 for 50% off one year of Yearly or Forever' },
        { id: 4, text: 'KAARI40 for 50% off one year of Yearly or Forever' },
        { id: 5, text: 'KAARI40 for 50% off one year of Yearly or Forever' },
        { id: 6, text: 'KAARI40 for 50% off one year of Yearly or Forever' },
        { id: 7, text: 'KAARI40 for 50% off one year of Yearly or Forever' },
        { id: 8, text: 'KAARI40 for 50% off one year of Yearly or Forever' },
        { id: 9, text: 'KAARI40 for 50% off one year of Yearly or Forever' },
        { id: 10, text: 'KAARI40 for 50% off one year of Yearly or Forever' },
        { id: 11, text: 'KAARI40 for 50% off one year of Yearly or Forever' },
        { id: 12, text: 'KAARI40 for 50% off one year of Yearly or Forever' }
    ];

    return (
        <PerksPageStyle>
            <h1 className="section-title">Kaari's Perks Program</h1>
            <div className="perks-content">

                <div className="perks-list">
                    {perksList.map(perk => (
                        <div key={perk.id} className="perk-item">
                            <div className="perk-info">
                                
                                <div className="premium-tag">
                                    <img src={PerkBird} alt="Perk Bird" />
                                    <span>Freedom</span>
                                </div>
                                <span className="perk-text">{perk.text}</span>
                                <WhiteButtonSM32 text="Use Perk" />
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </PerksPageStyle>
    );
};

export default PerksPage;
