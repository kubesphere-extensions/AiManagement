import styled from 'styled-components';
import { Col } from '@kubed/components';

interface ProgressBlockProps {
  percentage: string;
}

export const StyledCol = styled(Col)`
  overflow: hidden;
`;

export const Columns = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  margin-right: 12px;
`;

export const BgColor = styled.div`
  background: #F9FBFD;
  padding: 12px;
  border-radius: 2px;

  &.padding4 {
    padding: 4px 12px;
  }
`

export const TextName = styled.div`
  display: flex;
  align-items: center;
  color: #79879C;
  font-size: 12px;
  margin-bottom: 8px;
  .mr4 {
    margin-right: 4px;
  }
`

export const ColumnItem = styled.div`
  flex: 0 0 calc(50%);
`;

export const StatusColor = styled.div`
  position: relative;
  padding-left: 16px;
  color: #79879C;

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
    background-color: #55BC8A;
  }

  &.err::before{
    background-color: #CA2621;
  }
  &.info::before{
    background-color: #329DCE;
  }
  &.off::before{
    background-color: #79879C;
  }
`
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
`
