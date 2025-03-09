import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

interface ProgressBannerBaseModelProps {
  status: 'Pending' | 'Approved' | 'Declined';
}

const ProgressBannerBaseModel = styled.div<ProgressBannerBaseModelProps>`
  background-color: ${props => {
    switch (props.status) {
      case 'Pending':
        return Theme.colors.blue; // Light purple background: ;
      case 'Approved':
        return Theme.colors.success; // Light green background
      case 'Declined':
        return Theme.colors.error; // Light red background
      default:
        return Theme.colors.white;
    }
  }};
  border-radius: 10px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 78px;
  max-width: 89px;
  
  height: 27px;
  font: ${Theme.typography.fonts.smallB};
  color: ${Theme.colors.white};
  border: none;
  border-radius: ${Theme.borders.radius.extreme};
  transition: all 0.3s ease;

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    pointer-events: none;
    user-select: none;
  }

  &:hover {
    opacity: 0.9;
  }
`;

export default ProgressBannerBaseModel;
