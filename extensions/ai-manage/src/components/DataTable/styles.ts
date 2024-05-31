import styled from 'styled-components';
import { Card } from '@kubed/components';

export const TableWrapper = styled(Card)`
  position: relative;
`;

export const TableMain = styled.div`
  // padding: 0 12px 12px;
  overflow-x: auto;
  &.left-scrolling {
    .table-header-cell-fixed-left-last:after,
    .table-data-cell-fixed-left-last:after {
      box-shadow: inset 10px 0 8px -8px rgb(119 133 146 / 30%);
    }
  }

  &.right-scrolling {
    .table-header-cell-fixed-right-last:after,
    .table-data-cell-fixed-right-last:after {
      box-shadow: inset -10px 0 8px -8px rgb(119 133 146 / 30%);
    }
  }
  table {
    width: 100%;
    text-align: left;
    white-space: nowrap;
  }
`;

export const Table = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse;
  border-spacing: 0;

  th {
    padding: 16px 12px;
    font-family: ${({ theme }) => theme.font.sans};
    font-size: 12px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    color: #79879c;
    cursor: pointer;
    &.table-header-cell-fixed-left-last:after,
    &.table-data-cell-fixed-left-last:after {
      position: absolute;
      top: 0;
      right: -1px;
      bottom: -1px;
      width: 20px;
      transform: translateX(100%);
      transition: box-shadow 0.3s;
      content: '';
      pointer-events: none;
    }

    &.table-header-cell-fixed-right-last:after,
    &.table-data-cell-fixed-right-last:after {
      position: absolute;
      top: 0;
      bottom: -1px;
      left: -1px;
      width: 20px;
      transform: translateX(-100%);
      transition: box-shadow 0.3s;
      content: '';
      pointer-events: none;
    }
  }

  .table-selector {
    line-height: 1;
  }
`;

export const TBody = styled.tbody`
  tr.normal-tr {
    &:hover {
      td {
        background-color: #eff4f9;
      }
    }

    &:last-child {
      td {
        border-bottom: 1px solid #eff4f9;
      }

      &.row-selected {
        & > td {
          border-bottom: 1px solid #55bc8a;
        }
      }
    }

    &.row-selected {
      & > td {
        border-top: 1px solid #55bc8a;
        background-color: #eff4f9;

        &:first-child {
          border-left: 1px solid #55bc8a;
        }

        &:last-child {
          border-right: 1px solid #55bc8a;
        }
      }

      & + .row-selected {
        & > td {
          border-top: 1px solid transparent;
        }
      }

      & + tr {
        & > td {
          border-top: 1px solid #55bc8a;
        }
      }
    }
  }

  tr.normal-tr > td {
    height: 56px;
    padding: 8px 12px;
    border-top: 1px solid #eff4f9;
    font-family: ${({ theme }) => theme.font.sans};
    font-size: 12px;
    font-weight: 400;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    color: #242e42;
    word-break: break-all;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #fff;

    &:first-child {
      border-left: 1px solid transparent;
    }

    &:last-child {
      border-right: 1px solid transparent;
    }
    &.table-header-cell-fixed-left-last:after,
    &.table-data-cell-fixed-left-last:after {
      position: absolute;
      top: 0;
      right: -1px;
      bottom: -1px;
      width: 20px;
      transform: translateX(100%);
      transition: box-shadow 0.3s;
      content: '';
      pointer-events: none;
      border-right: none;
    }

    &.table-header-cell-fixed-right-last:after,
    &.table-data-cell-fixed-right-last:after {
      position: absolute;
      top: 0;
      bottom: -1px;
      left: -1px;
      width: 20px;
      transform: translateX(-100%);
      transition: box-shadow 0.3s;
      content: '';
      pointer-events: none;
      border-left: none;
    }
  }
  }
`;
