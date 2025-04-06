import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

export const HeaderBlogStyle = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: ${Theme.colors.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .logo {
    display: flex;
    align-items: center;
    
    img {
      height: 40px;
    }
  }

  .navigation {
    display: flex;
    gap: 32px;
    align-items: center;

    a {
      font: ${Theme.typography.fonts.text16};
      color: ${Theme.colors.black};
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: ${Theme.colors.primary};
      }

      &.active {
        font-weight: 700;
        color: ${Theme.colors.primary};
      }
    }
  }

  .actions {
    display: flex;
    gap: 16px;
    align-items: center;

    button {
      cursor: pointer;
    }
  }
`; 