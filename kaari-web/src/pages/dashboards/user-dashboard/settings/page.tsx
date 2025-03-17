import React from 'react';
import { SettingsPageStyle } from './styles';

const SettingsPage: React.FC = () => {
    return (
        <SettingsPageStyle>
            <h1 className="section-title">Settings</h1>
            <div className="settings-content">
                <p>Your account settings will appear here.</p>
            </div>
        </SettingsPageStyle>
    );
};

export default SettingsPage;
