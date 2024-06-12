import React, { useRef, useMemo } from 'react';

import styled from 'styled-components';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 16px;
  overflow: hidden;
`;

function Dashboard() {
  const iframeRef: any = useRef(null);

  const url = useMemo(() => {
    const grafanaUrl = globals?.config?.grafana ?? 'http://60.216.39.180:31919';
    // eslint-disable-next-line max-len
    const baseUrl = `${grafanaUrl}/d/5Zr9HhYSk/node-exporter-infiniband?orgId=1&from=now-1h&to=now&theme=light&refresh=10s`;
    return baseUrl;
  }, []);

  return (
    <Wrap>
      <iframe
        id="ib-dashboard"
        ref={iframeRef}
        src={url}
        width="100%"
        style={{
          height: 'calc(100vh - 116px)',
          width: 'calc(100vw - 210px)',
          border: 0,
          marginLeft: -85,
        }}
      ></iframe>
    </Wrap>
  );
}

export default Dashboard;
