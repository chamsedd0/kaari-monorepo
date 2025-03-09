import { CardBaseModelStylePhotoshoot } from "../../styles/cards/card-base-model-style-photoshoot";

export const PhotoshootCardEnum = ({title, description, number, image}: {title: string, description: string, number: number, image: string}) => {
  return (
    <CardBaseModelStylePhotoshoot>
        <img src={image} alt="Photoshoot" />
        <div className="text">
            <div className="title">
                {title}
            </div>
            <div className="description">
                {description}
            </div>
        </div>
        <div className="enums">
            <div className="enum">
                <span>{number}</span>
            </div>
        </div>
    </CardBaseModelStylePhotoshoot>
  );
};
