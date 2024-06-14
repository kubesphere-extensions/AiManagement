import React, { useMemo } from 'react';

import { Warning } from '@kubed/icons';

import { EmptyTip, Wrap } from './styles';

function HfkMonitor() {
  const url = useMemo(() => {
    const grafanaUrl = globals?.config?.grafana;
    // eslint-disable-next-line max-len
    const baseUrl = `${grafanaUrl}/d/vlvPlrgnk/hexaflake-gpu-metrics?orgId=1&var-gpu=0-0&var-node_name=hfk01&refresh=10s&from=now-30m&to=now&theme=light`;
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
        id="hfk-dashboard"
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

export default HfkMonitor;
