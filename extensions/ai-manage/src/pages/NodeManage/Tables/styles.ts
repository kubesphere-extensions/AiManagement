import styled from 'styled-components';
import { Row, Entity, Field, Col, Navs } from '@kubed/components';

export const TableContent = styled.div`
  position: relative;
`

export const StyledNav = styled(Navs)`
  position: absolute;
  left: 20px;
  top: 10px;
  z-index: 188;
`;

export const HiddendNav = styled(Navs)`
  opacity: 0;
  visibility: hidden;
`;

export const FullRow = styled(Row)`
  width: 100%;
`;
export const FullCol = styled(Col)`
  margin: 0;
`;
export const StyledEntity = styled(Entity)`
  padding: 0;
`;
export const StyledField = styled(Field)`
  align-items: flex-start;
  .field-label {
    white-space: break-spaces;
  }
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

export const NumDanger = styled.span`
  font-weight: bold;
  color: #ea4641;
`;

export const CollapseWrap = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  .num {
    margin-right: 5px;
  }
`;

export const BaseTable = styled.div`
  padding: 10px;
  & > table {
    width: 100%;
    text-align: left;
    white-space: nowrap;
    display: table;
    border-collapse: collapse;
    border-spacing: 0;
    thead {
      display: table-header-group;
      background-color: #fff;
      th {
        box-shadow: inset 0 -1px 0 0 #eff4f9;
        padding: 16px 12px;
        font-size: 12px;
        font-weight: 600;
        border-top: 1px solid #eff4f9;
        border-left: 1px solid #eff4f9;
        &:last-child {
          border-right: 1px solid #eff4f9;
        }
      }
    }
    tbody {
      display: table-row-group;
      tr {
        color: inherit;
        display: table-row;
        vertical-align: middle;
        border-collapse: collapse;
        border-spacing: 0;
        outline: 0;
        &:hover td {
          background-color: #eff4f9;
        }
        td {
          display: table-cell;
          vertical-align: inherit;
          border-left: 1px solid #eff4f9;
          color: #242e42;
          padding: 8px 12px;
          text-align: left;
          box-shadow: inset 0 -1px 0 0 #eff4f9;
          &:last-child {
            border-right: 1px solid #eff4f9;
          }
        }
      }
    }
  }
`;
