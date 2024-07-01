import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  justify-content: space-between;
  & .title {
    font-size: 14px;
    font-weight: 600;
  }
  & .desc {
    color: #79879c;
  }
`;

export const FlexCenter = styled.div<{ gap?: string }>`
  display: flex;
  width: content-width;
  align-items: center;
  flex-wrap: wrap;
  gap: ${props => props?.gap || '12px'};
`;

export const ConfigWrap = styled.div`
  background-color: #f9fbfd;
  border-radius: 4px;
  margin-bottom: 12px;
  padding: 12px;
  position: relative;
`;

export const ItemTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const ItemTitleWrap = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  padding: 6px 0;
  & .sub_title {
    margin-left: 4px;
    font-size: 12px;
    width: 100px;
    font-weight: 600;
  }
`;

export const ConfigItem = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #e3e9ef;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
  line-height: 30px;
  gap: 10px;
`;

export const FieldWrap = styled.div`
  display: flex;
  align-items: center;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 20px;
`;

export const Address = styled.div`
  display: flex;
  align-items: center;
  background-color: #e3e9ef;
  padding: 0px 8px;
  border-radius: 15px;
  line-height: 24px;
`;
