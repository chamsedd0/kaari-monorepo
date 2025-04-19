import { Theme } from '../../../../theme/theme';
import styled from 'styled-components';

const UploadFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
`;

const UploadFieldTitle = styled.div`
  font: ${Theme.typography.fonts.largeB};
  color: ${Theme.colors.black};
  margin-bottom: 16px;
`;

const UploadFieldBaseModel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 20px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 100px;
  background-color: ${Theme.colors.white};
  transition: all 0.2s ease;
  color: ${Theme.colors.black};
  cursor: pointer;
  font: ${Theme.typography.fonts.mediumM};
  
  &:hover {
    border-color: ${Theme.colors.secondary};
  }
  
  &.has-files {
    border-color: ${Theme.colors.secondary};
  }

  img, svg {
    width: 20px;
    height: 20px;
    color: ${Theme.colors.secondary};
  }

  .file-text {
    color: ${Theme.colors.gray2};
  }

  &.purple-icon {
    img, svg {
      color: ${Theme.colors.secondary};
    }
  }
`;

export { UploadFieldContainer, UploadFieldTitle, UploadFieldBaseModel };
export default UploadFieldBaseModel;
