import styled from 'styled-components';
import { Col } from '@kubed/components';

interface ProgressBlockProps {
  percentage: string;
}

export const StyledCol = styled(Col)`
  overflow: hidden;
`;

export const StyleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
`;

export const Columns = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

export const BgColor = styled.div`
  background: #f9fbfd;
  padding: 12px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex: 1;

  &.padding4 {
    padding: 4px 12px;
  }
  & .text {
    white-space: nowrap;
  }
  & .text-err {
    white-space: nowrap;
    div:first-child {
      color: #ca2621;
    }
  }
`;

export const TextName = styled.div`
  display: flex;
  align-items: center;
  color: #79879c;
  font-size: 12px;
  margin-bottom: 8px;
  .mr4 {
    margin-right: 4px;
  }
`;

export const ColumnItem = styled.div`
  // flex: 0 0 calc(50%);
  flex: 1;
`;

export const StatusColor = styled.div`
  position: relative;
  padding-left: 16px;
  color: #79879c;

  &::before {
    display: block;
    position: absolute;
    left: 0;
    top: 6px;
    clear: both;
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
    background-color: #55bc8a;
  }

  &.err::before {
    background-color: #ca2621;
  }
  &.info::before {
    background-color: #329dce;
  }
  &.off::before {
    background-color: #79879c;
  }
  &.waring::before {
    background-color: #f5a623;
  }
`;
export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #fff;
  border-radius: 2px;
  margin-top: 8px;
  display: flex;
  gap: 2px;
  overflow: hidden;
`;

export const ProgressBlock = styled.div<ProgressBlockProps>`
  height: 100%;
  flex: ${props => props.percentage};
  background-color: ${props => props.color};
`;

export const FieldLabel = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
  font-weight: 400;
  color: #79879c;
  max-width: 300px;
`;

export const Taints = styled.span`
  display: inline-block;
  min-width: 20px;
  height: 20px;
  margin-left: 8px;
  padding: 0 6px;
  line-height: 20px;
  border-radius: 2px;
  box-shadow: 0 4px 8px 0 rgba(36, 46, 66, 0.2);
  background-color: #181d28;
  text-align: center;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  &:hover {
    box-shadow: none;
  }
`;

export const Resource = styled.div`
  & > span {
    display: inline-block;
    vertical-align: middle;
  }
  .kubed-icon-dark {
    color: #fff;
    fill: #ea4641;
  }
`;

export const IconWrap = styled.div`
  height: 40px;
  margin-right: 12px;
`;
