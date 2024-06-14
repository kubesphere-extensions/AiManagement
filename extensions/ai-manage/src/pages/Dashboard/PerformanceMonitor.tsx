import React, { useRef, useMemo } from 'react';
import { request } from '@ks-console/shared';
import { useQuery } from 'react-query';
import { Loading } from '@kubed/components';
import { Warning } from '@kubed/icons';

import { EmptyTip, Wrap } from './styles';

function Dashboard() {
  const iframeRef: any = useRef(null);

  const onIframeLoad = () => {
    if (iframeRef.current) {
      try {
        const iframeDom =
          iframeRef.current?.contentWindow?.document || iframeRef?.current?.contentDocument;
        if (iframeDom) {
          if (iframeDom.querySelector('#reactRoot .sidemenu')) {
            iframeDom.querySelector('#reactRoot .sidemenu').style.display = 'none';
          }
        }
      } catch (error) {}
    }
  };
  const { data, isFetching } = useQuery(['fetchGpuNode'], async () => {
    return request.get('/kapis/aicp.kubesphere.io/v1/gpu/list_gpu_dev_info').then(res => {
      if ((res as any)?.ret_code === 0) {
        return res?.data ?? {};
      }
    });
  });

  const url = useMemo(() => {
    const defaultHost = globals?.config?.grafana ?? 'http://60.216.39.180:31919';
    const baseUrl = `${defaultHost}/d/wh1_1EfSk/nvidia-dcgm-performance-metric-dashboard?orgId=1`;
    const configUrl = '&var-gpu=All&theme=light&refresh=10s';
    const nodeSet = new Set<string>([]);
    data?.forEach((item: any) => {
      if (item?.gpu_node_id) {
        const id: string = item?.gpu_node_id ?? '';
        nodeSet.add(id);
      }
    });
    return `${baseUrl}${Array.from(nodeSet)
      .map(item => `&var-Hostname=${item}`)
      .join('')}${configUrl}`;
  }, [data]);

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
      {isFetching && <Loading className="page-loading" />}
      <iframe
        id="my-dashboard"
        ref={iframeRef}
        src={url}
        width="100%"
        style={{
          height: 'calc(100vh - 116px)',
          width: 'calc(100vw - 210px)',
          border: 0,
          marginLeft: -85,
        }}
        onLoad={onIframeLoad}
      />
    </Wrap>
  );
}

export default Dashboard;
