import { Theme } from '../../../../theme/theme';
import styled from 'styled-components';

const UploadFieldContainersmall = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
  max-height: 50px;
  max-width: 130px;
`;

const UploadFieldsmallModel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 15px 20px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 100px;
  background-color: ${Theme.colors.white};
  transition: all 0.2s ease;
  color: ${Theme.colors.gray2};
  cursor: pointer;
  font: ${Theme.typography.fonts.largeM};
  
  &:hover {
    border-color: ${Theme.colors.secondary};
  }
  
  &.has-files {
    border-color: ${Theme.colors.secondary};
  }

  img {
    width: 20px;
    height: 20px;
    min-width: 20px;
    min-height: 20px;
    max-width: 20px;
    max-height: 20px;
    object-fit: contain;
  }
`;

export { UploadFieldContainersmall, UploadFieldsmallModel };
export default UploadFieldsmallModel;
