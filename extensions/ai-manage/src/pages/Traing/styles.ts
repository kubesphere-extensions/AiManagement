import styled from 'styled-components';
import { Field } from '@kubed/components';

export const StyledField = styled(Field)`
  align-items: flex-start;
  .field-label {
    white-space: break-spaces;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    border-color: ${props => (props.active ? '#55bc8a' : 'transparent')};
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

export const ResourceId = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .copy {
    opacity: 0;
    cursor: pointer;
    margin-top: 2px;
  }
  &:hover {
    .copy {
      opacity: 1;
    }
  }
`;
