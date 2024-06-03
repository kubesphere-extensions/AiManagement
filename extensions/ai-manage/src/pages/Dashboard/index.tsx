import React, { useMemo } from 'react';
import { request } from '@ks-console/shared';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Loading } from '@kubed/components';
import { Warning } from '@kubed/icons';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 16px;
  overflow: hidden;
`;

const EmptyTip = styled.div`
  width: 100%;
  height: 400px;
  padding-left: 16px;
  display: flex;
  font-size: 14px;
  align-items: center;
  justify-content: center;
`;

function Dashboard() {
  const { data, isFetching } = useQuery(['fetchGpuNode'], async () => {
    return request.get('/kapis/aicp.kubesphere.io/v1/gpu/list_gpu_dev_info').then(res => {
      if ((res as any)?.ret_code === 0) {
        return res?.data ?? {};
      }
    });
  });

  const url = useMemo(() => {
    const defaultHost = globals?.config?.grafana ?? 'http://60.216.39.180:31919';
    const baseUrl = `${defaultHost}/d/Oxed_c6Wz/nvidia-dcgm-exporter-dashboard?orgId=1`;
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
