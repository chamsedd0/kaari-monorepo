import { Theme } from '../../../../theme/theme';
import styled from 'styled-components';

const UploadFieldBaseModel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 370px;
  padding: 22px 24px;
  border: ${Theme.borders.primary};
  border-radius: ${Theme.borders.radius.extreme};
  background-color: ${Theme.colors.white};
  transition: all 0.3s ease;
  color: ${Theme.colors.black};
  cursor: pointer;
  font: ${Theme.typography.fonts.largeM};

  img {
    width: 21px;
    height: 21px;
  }
`;

export default UploadFieldBaseModel;
