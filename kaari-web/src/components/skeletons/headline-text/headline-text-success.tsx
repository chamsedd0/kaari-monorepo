import React from "react";
import { HeadlineTextStyle } from "../../styles/headline-text-style";
import { Theme } from "../../../theme/theme";
import styled from "styled-components";
import checkIcon from "../icons/Icon_Check2.svg";
import xIcon from "../icons/Cross-Icon-W.svg";

const SuccessHeadlineTextStyle = styled(HeadlineTextStyle)`
  background-color: ${Theme.colors.success};
`;

interface HeadlineTextSuccessProps {
  title: string;
  description: string;
  onClose?: () => void;
}

const HeadlineTextSuccess: React.FC<HeadlineTextSuccessProps> = ({
  title,
  description,
  onClose,
}) => {
  return (
    <SuccessHeadlineTextStyle>
      <div className="left-group">
        <img src={checkIcon} alt="Alert" />
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
    </SuccessHeadlineTextStyle>
  );
};

export default HeadlineTextSuccess;
