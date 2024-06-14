import React, { useRef, useMemo } from 'react';
import { Warning } from '@kubed/icons';

import { EmptyTip, Wrap } from './styles';

function Dashboard() {
  const iframeRef: any = useRef(null);

  const url = useMemo(() => {
    const grafanaUrl = globals?.config?.grafana;
    // eslint-disable-next-line max-len
    const baseUrl = `${grafanaUrl}/d/5Zr9HhYSk/node-exporter-infiniband?orgId=1&from=now-1h&to=now&theme=light&refresh=10s`;
    return baseUrl;
  }, []);

  if (!globals?.config?.grafana) {
    return (
      <EmptyTip>
        <Warning size={30} />
        请先配置grafana地址！
      </EmptyTip>
    );
  }

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
      />
    </Wrap>
  );
}

export default Dashboard;
