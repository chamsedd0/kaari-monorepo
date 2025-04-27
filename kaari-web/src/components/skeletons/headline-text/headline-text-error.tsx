import React from "react";
import { HeadlineTextStyle } from "../../styles/headline-text-style";
import { Theme } from "../../../theme/theme";
import styled from "styled-components";
import alertCircleIcon from "../icons/Icon-Alert-W.svg";
import xIcon from "../icons/Cross-Icon-W.svg";

const RejectedHeadlineTextStyle = styled(HeadlineTextStyle)`
  background-color: ${Theme.colors.error};
`;

interface HeadlineTextRejectedProps {
  title: string;
  description: string;
  onClose?: () => void;
}

const HeadlineTextRejected: React.FC<HeadlineTextRejectedProps> = ({
  title,
  description,
  onClose,
}) => {
  return (
    <RejectedHeadlineTextStyle>
      <div className="left-group">
        <img src={alertCircleIcon} alt="Alert" />
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
    </RejectedHeadlineTextStyle>
  );
};

export default HeadlineTextRejected;
