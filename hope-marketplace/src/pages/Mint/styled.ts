import styled, { css } from "styled-components";
import Button from "../../components/Button";

export const Wrapper = styled.div`
  height: 100%;
  padding: 0 5%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const MintDetailContainer = styled.div<{ isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ isMobile }) => (isMobile ? "auto" : "auto 30%")};
  grid-gap: 20px;
  padding: 30px;
  margin-top: ${({ isMobile }) => (isMobile ? "50px" : "110px")};
  margin-bottom: 90px;
  border: 3px solid #02e296;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.panelBackgroundColor};
  color: ${({ theme }) => theme.colors.fontColor};
`;

export const MintDetailInfo = styled.div`
  text-align: left;
`;

export const DetailTitle = styled.div<{ bold?: boolean; isMobile?: boolean }>`
  font-size: 25px;
  font-weight: ${({ bold }) => (bold ? "700" : "500")};
  margin-bottom: 25px;
  ${({ isMobile }) =>
    isMobile &&
    css`
      text-align: center;
    `}

  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const DetailInfo = styled.div<{ isMobile?: boolean }>`
  font-size: 22px;
  font-weight: 400;
  color: ${({ theme }) => (theme.isDark ? "white" : "#797979")};
  ${({ isMobile }) =>
    isMobile &&
    css`
      text-align: center;
    `}
`;

export const DetailBlockContainer = styled.div<{ flexDirection?: string }>`
  width: 100%;
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection ?? "row"};
  /* justify-content: space-evenly; */
  justify-content: space-between;
  align-items: center;
  margin: 50px 0 35px 0;
`;

export const DetailBlock = styled.div<{ colored?: boolean; percent?: number }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  padding: 10px;
  width: 100%;
  border: 1px solid #02e296;
  /* border-radius: 4px; */
  max-width: 550px;
  ${({ colored }) =>
    colored &&
    css`
      background: rgba(2, 226, 150, 0.12);
    `}
  ${({ percent }) =>
    percent &&
    css`
      &:before {
        content: "";
        background: rgba(2, 226, 150, 0.3);
        width: ${percent}%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
    `}
`;

export const DetailBlockTitle = styled.div<{ fontSize?: string }>`
  text-align: center;
  /* color: ${({ theme }) => (theme.isDark ? "white" : "#797979")}; */
  ${({ fontSize }) =>
    fontSize &&
    css`
      font-size: ${fontSize};
    `}
`;

export const DetailBlockContent = styled.div<{ fontSize?: string }>`
  text-align: center;
  margin-top: 15px;
  ${({ fontSize }) =>
    fontSize &&
    css`
      font-size: ${fontSize};
    `}
`;

export const OperationContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? "column" : "row")};
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  gap: 20px;
`;

export const FlexColumn = styled.div<{ width?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${({ width }) =>
    width &&
    css`
      width: ${width};
    `};
`;

export const MintButton = styled(Button)<{
  width?: string;
  soldOut: boolean;
  isMobile: boolean;
  backgroundColor?: string;
}>`
  margin: 0;
  background-color: ${({ soldOut, backgroundColor }) =>
    backgroundColor ? backgroundColor : soldOut ? "#C63939" : "#02e296"};
  border: 1px solid black;
  border-radius: 4px;
  font-weight: 700;
  width: ${({ width, isMobile }) => (isMobile ? "100%" : width ?? "325px")};
  height: 53px;
  color: ${({ soldOut }) => (soldOut ? "white" : "black")};
  transition: opacity 0.5s;
  &:hover {
    opacity: 0.8;
    /* background-color: ${({ soldOut, backgroundColor }) =>
      backgroundColor ? backgroundColor : soldOut ? "#C63939" : "#39c639"}; */
  }
`;

export const LeftTimeContainer = styled.span`
  position: absolute;
  bottom: -40px;
`;

export const MintImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

export const MintImage = styled.img<{ isMobile?: boolean }>`
  /* width: 100%; */
  margin: auto;
  max-width: min(500px, 100%);
`;

export const StyledButton = styled(Button)<{
  backgroundColor?: string;
  color?: string;
  checked?: boolean;
}>`
  width: 170px;
  height: 45px;
  font-size: 18px;
  color: black;
  position: relative;
  ${({ backgroundColor }) =>
    backgroundColor &&
    css`
      background-color: ${backgroundColor};
    `};
  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `};
  border: 1px solid #000;
  border-radius: 4px;
  margin-right: 30px;
  ${({ checked }) =>
    checked &&
    css`
      border-width: 3px;
    `}
`;

export const DetailContainer = styled.div`
  float: right;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 5px 0;
`;

export const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  svg {
    path {
      color: red;
      fill: ${({ theme }) => theme.colors.fontColors};
    }
  }
`;

export const Status = styled.div<{ background: string; color: string }>`
  font-size: 20px;
  height: 20px;
  padding: 5px;
  padding-left: 45px;
  display: flex;
  align-items: center;
  background: ${({ background }) => background};
  color: ${({ color }) => color};
  border: 1px solid ${({ color }) => color};
  border-radius: 10px;
  position: relative;
  &:before {
    content: "";
    width: 20px;
    height: 20px;
    background: ${({ color }) => color};
    border-radius: 15px;
    position: absolute;
    left: 10px;
    top: 5px;
  }
`;
