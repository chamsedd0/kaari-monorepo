import React, { useState, useRef, useEffect } from 'react';
import { ModalOverlayStyle, SpokenLanguagesModalStyle } from '../../../styles/constructed/modals/auth-modal-style';
import { FaTimes } from 'react-icons/fa';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { useTranslation } from 'react-i18next';

interface Language {
  name: string;
  selected: boolean;
}

interface SpokenLanguagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (languages: string[]) => void;
  initialSelectedLanguages?: string[];
}

export const SpokenLanguagesModal: React.FC<SpokenLanguagesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSelectedLanguages = []
}) => {
  const { t } = useTranslation();
  const [languages, setLanguages] = useState<Language[]>([
    { name: 'English', selected: false },
    { name: 'French', selected: false },
    { name: 'Spanish', selected: false },
    { name: 'Italian', selected: false },
    { name: 'German', selected: false },
    { name: 'Dutch', selected: false },
    { name: 'Portuguese', selected: false },
    { name: 'Polish', selected: false },
    { name: 'Russian', selected: false },
    { name: 'Hindi', selected: false },
    { name: 'Arabic', selected: false },
    { name: 'Swedish', selected: false },
    { name: 'Mandarin', selected: false },
    { name: 'Turkish', selected: false },
    { name: 'Greek', selected: false },
    { name: 'Danish', selected: false },
    { name: 'Finnish', selected: false },
    { name: 'Japanese', selected: false },
    { name: 'Korean', selected: false },
    { name: 'Bengali', selected: false }
  ]);
  
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize with initialSelectedLanguages when opened
  useEffect(() => {
    if (isOpen && initialSelectedLanguages.length > 0) {
      const updatedLanguages = languages.map(lang => ({
        ...lang,
        selected: initialSelectedLanguages.includes(lang.name)
      }));
      setLanguages(updatedLanguages);
    }
  }, [isOpen, initialSelectedLanguages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLanguageChange = (index: number) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index].selected = !updatedLanguages[index].selected;
    setLanguages(updatedLanguages);
  };

  const handleSave = () => {
    const selectedLanguages = languages
      .filter(lang => lang.selected)
      .map(lang => lang.name);
    
    onSave(selectedLanguages);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlayStyle>
      <SpokenLanguagesModalStyle ref={modalRef}>
        <div className="modal-header">
          <div className="logo-container">
            <h2>{t('spoken_languages')}</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="languages-header">
            <p>{t('what_languages_fluent')}</p>
          </div>

          <div className="languages-grid">
            {languages.map((language, index) => (
              <div className="language-checkbox" key={language.name}>
                <input
                  type="checkbox"
                  id={`lang-${language.name}`}
                  checked={language.selected}
                  onChange={() => handleLanguageChange(index)}
                />
                <label htmlFor={`lang-${language.name}`}>{language.name}</label>
              </div>
            ))}
          </div>

          <div className="button-container">
            <PurpleButtonLB60 
              text="Add Languages" 
              onClick={handleSave} 
            />
          </div>
        </div>
      </SpokenLanguagesModalStyle>
    </ModalOverlayStyle>
  );
};

export default SpokenLanguagesModal; 