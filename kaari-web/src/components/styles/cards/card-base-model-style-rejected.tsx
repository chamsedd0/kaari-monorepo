import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

export const CardBaseModelStyleRejected = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border: ${Theme.borders.primary};
  border-radius: ${Theme.borders.radius.md};
  background: ${Theme.colors.white};
`;


