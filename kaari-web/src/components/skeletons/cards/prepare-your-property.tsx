import React from "react";
import { PreparePropertyCard } from "../../styles/cards/card-base-model-style-prepare-property";
import svg from "../../../components/skeletons/icons/Icon-clean.svg";

interface PreparePropertyProps {
  title?: string;
  items?: Array<{
    number: number;
    title: string;
    description: string;
  }>;
}

const PreparePropertyComponent: React.FC<PreparePropertyProps> = ({
  title = "Prepare your property",
  items = [
    {
      number: 1,
      title: "Deep Clean",
      description: "Thoroughly clean every corner, window, and surface to ensure the property looks immaculate."
    },
    {
      number: 2,
      title: "Declutter",
      description: "Remove personal items and excess decor to make the space look tidy and spacious."
    },
    {
      number: 3,
      title: "Stage the Rooms",
      description: "Arrange furniture thoughtfully to highlight the space's functionality and appeal."
    },
    {
      number: 4,
      title: "Maximize the light",
      description: "Open curtains to let in natural light and ensure all light fixtures are working to enhance the ambiance."
    },
    {
      number: 5,
      title: "Accentuate Features",
      description: "Clean and display unique features such as fireplaces or scenic views prominently."
    },
    {
      number: 6,
      title: "Prepare Outdoors",
      description: "Tidy up lawns, pathways, and patios to enhance external appeal."
    },
    {
      number: 7,
      title: "Simple Decorations",
      description: "Add neutral decorations like fresh flowers to inject vibrancy without distraction."
    },
    {
      number: 8,
      title: "Welcoming Entrance",
      description: "Ensure the entrance is inviting with a clean doormat and decorative plants."
    }

  ],
}) => {
  return (
    <PreparePropertyCard>
      <div className="title container">
        <h3 className="title">{title}</h3>
        <img src={svg} alt="Info" />
      </div>
      <div className="content-container">
        {items.map((item, index) => (
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
