import React from "react";
import { PreparePropertyCard } from "../../styles/cards/card-base-model-style-prepare-property";
import svg from "../../../components/skeletons/icons/Icon-clean.svg";
import { useTranslation } from "react-i18next";

interface PreparePropertyProps {
  title?: string;
  items?: Array<{
    number: number;
    title: string;
    description: string;
  }>;
}

const PreparePropertyComponent: React.FC<PreparePropertyProps> = ({
  title,
  items,
}) => {
  const { t } = useTranslation();
  
  // Use default values with translations if not provided
  const defaultTitle = t('advertiser_dashboard.photoshoot.prepare_property_title', 'Prepare your property');
  
  const defaultItems = [
    {
      number: 1,
      title: t('advertiser_dashboard.photoshoot.prepare_deep_clean_title', 'Deep Clean'),
      description: t('advertiser_dashboard.photoshoot.prepare_deep_clean_desc', 'Thoroughly clean every corner, window, and surface to ensure the property looks immaculate.')
    },
    {
      number: 2,
      title: t('advertiser_dashboard.photoshoot.prepare_declutter_title', 'Declutter'),
      description: t('advertiser_dashboard.photoshoot.prepare_declutter_desc', 'Remove personal items and excess decor to make the space look tidy and spacious.')
    },
    {
      number: 3,
      title: t('advertiser_dashboard.photoshoot.prepare_stage_title', 'Stage the Rooms'),
      description: t('advertiser_dashboard.photoshoot.prepare_stage_desc', 'Arrange furniture thoughtfully to highlight the space\'s functionality and appeal.')
    },
    {
      number: 4,
      title: t('advertiser_dashboard.photoshoot.prepare_light_title', 'Maximize the light'),
      description: t('advertiser_dashboard.photoshoot.prepare_light_desc', 'Open curtains to let in natural light and ensure all light fixtures are working to enhance the ambiance.')
    },
    {
      number: 5,
      title: t('advertiser_dashboard.photoshoot.prepare_features_title', 'Accentuate Features'),
      description: t('advertiser_dashboard.photoshoot.prepare_features_desc', 'Clean and display unique features such as fireplaces or scenic views prominently.')
    },
    {
      number: 6,
      title: t('advertiser_dashboard.photoshoot.prepare_outdoors_title', 'Prepare Outdoors'),
      description: t('advertiser_dashboard.photoshoot.prepare_outdoors_desc', 'Tidy up lawns, pathways, and patios to enhance external appeal.')
    },
    {
      number: 7,
      title: t('advertiser_dashboard.photoshoot.prepare_decorations_title', 'Simple Decorations'),
      description: t('advertiser_dashboard.photoshoot.prepare_decorations_desc', 'Add neutral decorations like fresh flowers to inject vibrancy without distraction.')
    },
    {
      number: 8,
      title: t('advertiser_dashboard.photoshoot.prepare_entrance_title', 'Welcoming Entrance'),
      description: t('advertiser_dashboard.photoshoot.prepare_entrance_desc', 'Ensure the entrance is inviting with a clean doormat and decorative plants.')
    }
  ];

  // Use provided values or defaults
  const displayTitle = title || defaultTitle;
  const displayItems = items || defaultItems;

  return (
    <PreparePropertyCard>
      <div className="title container">
        <h3 className="title">{displayTitle}</h3>
        <img src={svg} alt={t('advertiser_dashboard.photoshoot.prepare_icon_alt', 'Info')} />
      </div>
      <div className="content-container">
        {displayItems.map((item, index) => (
          <div className="prepare-item" key={index}>
             <div className="text">
            <div className="number-text-container">
              <div className="number">{item.number}</div> 
              <span className="item-title">{item.title}</span>
            </div>
              <span className="item-description">{item.description}</span>
            </div>
          </div>
        ))}
      </div>
    </PreparePropertyCard>
  );
};

export default PreparePropertyComponent;
