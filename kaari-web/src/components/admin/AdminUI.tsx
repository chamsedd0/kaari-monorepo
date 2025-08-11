import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../../theme/theme';

export const PageContainer = styled.div`
  padding: clamp(16px, 2.2vw, 32px);
  max-width: 1440px;
  margin: 0 auto;
`;

export const HeaderContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
`;

export const Heading = styled.div`
  h1 {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin: 0 0 6px 0;
  }
  p {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
    margin: 0;
  }
`;

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid ${Theme.colors.tertiary}50;
  background: radial-gradient(120% 140% at 10% -10%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.65) 60%), linear-gradient(180deg, rgba(255,255,255,0.34), rgba(255,255,255,0.2));
  backdrop-filter: saturate(140%) blur(14px);
  box-shadow: 0 14px 36px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.55);
  position: relative;
  &:after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.35);
  }
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.92);
  border: 1px solid ${Theme.colors.tertiary}60;
  border-radius: 100px;
  padding: 0 12px;
  height: 42px;
  input {
    border: none;
    outline: none;
    height: 100%;
    font: ${Theme.typography.fonts.smallM};
  }
  svg { color: ${Theme.colors.gray2}; }
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid ${Theme.colors.tertiary};
  background: ${Theme.colors.white};
  font: ${Theme.typography.fonts.smallM};
  color: ${Theme.colors.gray2};
`;

// shadcn-like button system
export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const buttonVariantStyles = {
  default: css`
    background: ${Theme.colors.primary};
    color: ${Theme.colors.white};
    border: 1px solid ${Theme.colors.primary};
    &:hover { background: ${Theme.colors.primary}cc; }
  `,
  secondary: css`
    background: ${Theme.colors.white};
    color: ${Theme.colors.primary};
    border: 1px solid ${Theme.colors.gray}30;
    &:hover { background: ${Theme.colors.gray}10; }
  `,
  outline: css`
    background: transparent;
    color: ${Theme.colors.primary};
    border: 1px solid ${Theme.colors.gray}50;
    &:hover { background: ${Theme.colors.gray}10; }
  `,
  ghost: css`
    background: transparent;
    color: ${Theme.colors.primary};
    border: 1px solid transparent;
    &:hover { background: ${Theme.colors.gray}10; }
  `,
  destructive: css`
    background: #DC2626;
    color: ${Theme.colors.white};
    border: 1px solid #DC2626;
    &:hover { background: #B91C1C; }
  `,
} as const;

const buttonSizeStyles = {
  sm: css`height: 34px; padding: 0 12px; font: ${Theme.typography.fonts.smallM};`,
  md: css`height: 40px; padding: 0 16px; font: ${Theme.typography.fonts.smallB};`,
  lg: css`height: 46px; padding: 0 18px; font: ${Theme.typography.fonts.mediumB};`,
  icon: css`height: 36px; width: 36px; padding: 0;`,
} as const;

export const Button = styled.button<{ $variant?: ButtonVariant; $size?: ButtonSize }>`
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  border-radius: 10px;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.06s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  outline: none;
  position: relative;
  ${(p) => buttonSizeStyles[p.$size || 'md']}
  ${(p) => buttonVariantStyles[p.$variant || 'secondary']}
  &:focus-visible { box-shadow: 0 0 0 2px ${Theme.colors.white}, 0 0 0 4px ${Theme.colors.secondary}; }
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const PrimaryButton = styled(Button).attrs({ $variant: 'default' as ButtonVariant })``;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.55);
  border-radius: 100px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.06s ease;
  &:hover { background: ${Theme.colors.tertiary}30; box-shadow: 0 8px 18px rgba(0,0,0,0.10); }
  &:active { transform: translateY(1px); }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
  }
`;

export const SecondaryButton = styled.button`
  appearance: none;
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.78));
  color: ${Theme.colors.primary};
  border: 1px solid rgba(255,255,255,0.55);
  border-radius: 100px;
  padding: 12px 20px;
  min-height: 42px;
  font: ${Theme.typography.fonts.smallB};
  letter-spacing: 0.2px;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5);
  transition: transform 0.06s ease, box-shadow 0.25s ease, background 0.2s ease;
  &:hover { background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.82)); box-shadow: 0 10px 22px rgba(0,0,0,0.10); }
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const DangerButton = styled(SecondaryButton)`
  color: #C62828;
  border-color: #FFCDD2;
  background: rgba(255, 235, 238, 0.8);
  &:hover { background: rgba(255, 235, 238, 1); }
`;

export const ButtonGroup = styled.div`
  display: inline-flex;
  gap: 10px;
  align-items: center;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font: ${Theme.typography.fonts.smallB};
  color: ${Theme.colors.gray2};
`;

const inputBase = css`
  width: 100%;
  border-radius: 100px;
  border: 1px solid ${Theme.colors.tertiary}60;
  background: rgba(255,255,255,0.9);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 20px rgba(0,0,0,0.04);
  padding: 12px 14px;
  font: ${Theme.typography.fonts.smallM};
  color: ${Theme.colors.black};
  outline: none;
  transition: box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  &:hover { background: rgba(255,255,255,0.95); }
  &:focus { border-color: ${Theme.colors.secondary}; box-shadow: 0 0 0 4px ${Theme.colors.secondary}30; }
  &::placeholder { color: ${Theme.colors.gray3}; }
`;

export const GlassInput = styled.input`
  ${inputBase}
`;

export const GlassSelect = styled.select`
  ${inputBase}
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, ${Theme.colors.gray3} 50%), linear-gradient(135deg, ${Theme.colors.gray3} 50%, transparent 50%);
  background-position: calc(100% - 16px) calc(1em + 2px), calc(100% - 12px) calc(1em + 2px);
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
`;

export const GlassTextArea = styled.textarea`
  ${inputBase}
  border-radius: 14px;
  min-height: 100px;
  resize: vertical;
`;

export const TableSection = styled.div`
  background: rgba(255,255,255,0.75);
  border-radius: 18px;
  border: 1px solid ${Theme.colors.tertiary}60;
  overflow: hidden;
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 36px rgba(0,0,0,0.08);
`;

type PageHeaderProps = { title: string; subtitle?: string; right?: React.ReactNode };
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, right }) => (
  <HeaderContainer>
    <Heading>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </Heading>
    {right}
  </HeaderContainer>
);

// Glassy card used for panels/sections
export const GlassCard = styled.div<{ padding?: number }>`
  position: relative;
  border-radius: 20px;
  border: 1px solid ${Theme.colors.tertiary}60;
  background: radial-gradient(140% 200% at 0% -30%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.8) 60%), linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0.2));
  backdrop-filter: saturate(140%) blur(14px);
  box-shadow: 0 18px 54px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.65);
  padding: ${({ padding }) => (padding ? `${padding}px` : '18px')};
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 220px;
    height: 220px;
    background: radial-gradient(closest-side, ${Theme.colors.secondary}15, transparent 65%);
    filter: blur(12px);
    pointer-events: none;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, rgba(255,255,255,0.65), rgba(255,255,255,0.2), rgba(255,255,255,0.5));
    opacity: 0.8;
    pointer-events: none;
  }
`;

// Table shell with sticky header and subtle row hover
export const GlassTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead th {
    position: sticky;
    top: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9));
    backdrop-filter: blur(12px);
    text-align: left;
    padding: 12px 16px;
    font: ${Theme.typography.fonts.smallB};
    color: ${Theme.colors.gray2};
    border-bottom: 1px solid ${Theme.colors.tertiary}60;
  }
  tbody td {
    padding: 14px 16px;
    border-bottom: 1px solid ${Theme.colors.tertiary}40;
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.black};
  }
  tbody tr {
    transition: background 0.2s ease;
  }
  tbody tr:nth-child(odd) {
    background: rgba(255,255,255,0.5);
  }
  tbody tr:hover {
    background: rgba(255,255,255,0.72);
  }
`;

// Status badge mapping
const statusColor = (status?: string) => {
  if (!status) return { bg: '#eef2f7', fg: '#607089' };
  const s = status.toLowerCase();
  if (s.includes('pending') || s.includes('await')) return { bg: '#FFF8E1', fg: '#B26A00' };
  if (s.includes('approved') || s.includes('success') || s.includes('completed') || s.includes('active')) return { bg: '#E8F5E9', fg: '#2E7D32' };
  if (s.includes('rejected') || s.includes('error') || s.includes('cancel')) return { bg: '#FFEBEE', fg: '#C62828' };
  return { bg: '#eef2f7', fg: '#607089' };
};

export const StatusBadge = styled.span<{ status?: string }>`
  ${({ status }) => {
    const { bg, fg } = statusColor(status);
    return css`
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      background: ${bg};
      color: ${fg};
      font: ${Theme.typography.fonts.smallB};
      box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset, 0 4px 10px rgba(0,0,0,0.05);
    `;
  }}
`;



