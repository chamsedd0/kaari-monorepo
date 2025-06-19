import React from 'react';
import styled from 'styled-components';
import { Theme } from '../theme/theme';

interface UserAvatarProps {
  name: string;
  profileImage?: string | null;
  size?: number;
  fontSize?: number;
  className?: string;
}

/**
 * UserAvatar component displays either the user's profile image if available,
 * or a circle with the user's first initial if no image is provided.
 */
const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  profileImage,
  size = 40,
  fontSize,
  className
}) => {
  // Get the first initial of the name
  const getInitial = () => {
    if (!name || name.trim() === '') return '?';
    return name.trim().charAt(0).toUpperCase();
  };

  // Calculate font size based on avatar size if not provided
  const calculatedFontSize = fontSize || Math.floor(size * 0.4);

  return (
    <AvatarContainer 
      className={className}
      size={size}
    >
      {profileImage ? (
        <AvatarImage src={profileImage} alt={name} />
      ) : (
        <InitialCircle backgroundColor={Theme.colors.secondary}>
          <Initial fontSize={calculatedFontSize}>{getInitial()}</Initial>
        </InitialCircle>
      )}
    </AvatarContainer>
  );
};

const AvatarContainer = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InitialCircle = styled.div<{ backgroundColor: string }>`
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const Initial = styled.span<{ fontSize: number }>`
  font-size: ${props => props.fontSize}px;
  line-height: 1;
  color: white;
`;

export default UserAvatar; 