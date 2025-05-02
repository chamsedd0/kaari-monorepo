import React from "react";
import { HeadlineTextStyle } from "../../styles/headline-text-style";
import { Theme } from "../../../theme/theme";
import styled from "styled-components";
import reportIcon from "../icons/Report.svg";
import xIcon from "../icons/Cross-Icon-w.svg";

const WarningHeadlineTextStyle = styled(HeadlineTextStyle)`
  background-color: ${Theme.colors.warning};
`;

interface HeadlineTextWarningProps {
  title: string;
  description: string;
  onClose?: () => void;
}

const HeadlineTextWarning: React.FC<HeadlineTextWarningProps> = ({
  title,
  description,
  onClose,
}) => {
  return (
    <WarningHeadlineTextStyle>
      <div className="left-group">
        <img src={reportIcon} alt="Alert" />
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
    </WarningHeadlineTextStyle>
  );
};

export default HeadlineTextWarning;
