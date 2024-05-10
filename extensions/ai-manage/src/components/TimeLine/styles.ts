import styled from 'styled-components';

export const Wrap = styled.ul`
  
`;

export const Item = styled.li`
  
`;

export const Circle = styled.div`
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #15a675;
  margin-right: 8px;
  ::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 6px;
    height: 6px;
    background-color: #fff;
    border-radius: 50%;
  }
`;

export const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: #324558;
  width: fit-content;
`;

export const Date = styled.div`
  color: #939ea9;
  line-height: 20px;
  width: fit-content;
`;

export const Desc = styled.div`
  color: #778592;
  width: fit-content;
`;

export const Border = styled.div<any>`
  padding-left: 12px;
  padding-bottom: 24px;
  margin-left: 4px;
  border-left: ${(props: any) => (props.isLast ? 'none' : '2px solid #e4ebf1')};
`;
