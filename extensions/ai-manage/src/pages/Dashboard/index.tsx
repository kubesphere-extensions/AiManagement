import React, { useRef, useMemo } from 'react';
import { request } from '@ks-console/shared';
import { useQuery } from 'react-query';
import { Loading } from '@kubed/components';

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
    return await request.get(`/kapis/aicp.kubesphere.io/v1/gpu/list_gpu_dev_info`).then(res => {
      if ((res as any)?.ret_code === 0) {
        return res?.data ?? {};
      }
    });
  });

  const url = useMemo(() => {
    const defaultHost = globals?.config?.grafana ?? 'http://60.216.39.180:31919';
    const baseUrl = `${defaultHost}/d/Oxed_c6Wz/nvidia-dcgm-exporter-dashboard?orgId=1`;
    const configUrl = '&var-gpu=All&theme=light&refresh=10s&kiosk=tv';
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

  return (
    <>
      {isFetching && <Loading className="page-loading" />}
      <iframe
        id="my-dashboard"
        ref={iframeRef}
        src={url}
        width="100%"
        style={{ height: 'calc(100vh - 116px)', border: 0 }}
        onLoad={onIframeLoad}
      ></iframe>
    </>
  );
}

export default Dashboard;
