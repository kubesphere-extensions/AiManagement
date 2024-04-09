import styled from 'styled-components';
import { Modal } from '@kubed/components';

export const FullScreenModal = styled(Modal)`
  position: relative;
  margin: 0;
  height: calc(100vh - 40px);
  .kubed-modal-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .kubed-modal-body {
      padding: 0px;
      flex: 1;
    }
    .kubed-modal-footer {
      display: none;
    }
    .log-line {
      white-space: break-spaces;
    }
  }
`;
