import React, { ReactNode } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { IMAGE_LINKS } from '../../utils/assetList';
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-20%);
    opacity: 0;
  }
  to {
    transform: translateY(0%);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0%);
    opacity: 1;
  }
  to {
    transform: translateY(-20%);
    opacity: 0;
  }
`;

const ModalOverlay = styled.div<{ $isopen: boolean; $alwaysOnTop: boolean }>`
  display: ${({ $isopen }) => ($isopen ? 'flex' : 'none')};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.backgroundOverlyColor};
  animation: ${({ $isopen }) => ($isopen ? fadeIn : fadeOut)} 0.3s ease-out;
  justify-content: center;
  align-items: center;
  position: fixed;
  ${({ $alwaysOnTop }) =>
    $alwaysOnTop &&
    css`
      z-index: 2147483645;
    `}
`;

const ModalContainer = styled.div<{ $isopen: boolean; $alwaysOnTop: boolean }>`
  background: ${({ theme }) => theme.modalBackground};
  border: ${({ theme }) => `1px solid ${theme.backgroundColor}`};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  text-align: center;
  overflow: hidden;
  animation: ${({ $isopen }) => ($isopen ? slideIn : slideOut)} 0.3s ease-out;
  ${({ $alwaysOnTop }) =>
    $alwaysOnTop &&
    css`
      z-index: 2147483646;
    `}
`;

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  margin-top: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const Img = styled.img`
  filter: ${({ theme }) => theme.footerImg};
`;

interface ModalProps {
  isopen: boolean;
  alwaysOnTop: boolean;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isopen, children }) => {
  return (
    <ModalOverlay $alwaysOnTop={true} $isopen={isopen}>
      <ModalContainer $alwaysOnTop={true} $isopen={isopen}>
        {children}
        <Footer>
          Powered by
          <Img src={IMAGE_LINKS['footer']} alt="Powered by arcana" />
        </Footer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
