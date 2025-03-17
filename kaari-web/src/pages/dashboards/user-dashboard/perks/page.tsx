import React from 'react';
import { PerksPageStyle } from './styles';

const PerksPage: React.FC = () => {
    return (
        <PerksPageStyle>
            <h1 className="section-title">Perks Program</h1>
            <div className="perks-content">
                <p>Your perks and rewards will appear here.</p>
            </div>
        </PerksPageStyle>
    );
};

export default PerksPage;
