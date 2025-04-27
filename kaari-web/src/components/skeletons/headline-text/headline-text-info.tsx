import React from "react";
import { HeadlineTextStyle } from "../../styles/headline-text-style";
import { Theme } from "../../../theme/theme";
import styled from "styled-components";
import infoIcon from "../icons/Icon_Info.svg";
import xIcon from "../icons/Cross-Icon-W.svg";

const InfoHeadlineTextStyle = styled(HeadlineTextStyle)`
  background-color: ${Theme.colors.blue};
`;

interface HeadlineTextInfoProps {
  title: string;
  description: string;
  onClose?: () => void;
}

const HeadlineTextInfo: React.FC<HeadlineTextInfoProps> = ({
  title,
  description,
  onClose,
}) => {
  return (
    <InfoHeadlineTextStyle>
      <div className="left-group">
        <img src={infoIcon} alt="Alert" />
        <div className="text-group">
          <div className="title">{title}</div>
          <div className="description">{description}</div>
        </div>
      </div>
      <div className="right-group">
        <img 
          src={xIcon} 
          alt="Close" 
          onClick={onClose}
        />
      </div>
    </InfoHeadlineTextStyle>
  );
};

export default HeadlineTextInfo;
