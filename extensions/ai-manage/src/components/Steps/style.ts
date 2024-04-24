import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0px 20px;
  background-color: #eff4f9;
`;

export const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  height: 100%;
  padding: 12px 16px;
`;

export const Current = styled(Step)`
  background-color: #FFFFFF;
`;
