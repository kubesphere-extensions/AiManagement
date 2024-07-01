import React, { useMemo } from 'react';
import { request } from '@ks-console/shared';
import { useQuery } from 'react-query';

import { Loading } from '@kubed/components';
import { Warning } from '@kubed/icons';
import { useStore } from '@kubed/stook';

import { EmptyTip, Wrap } from './styles';

function Dashboard() {
  const pathArr = window.location.pathname.split('/');
  const monitor = pathArr[pathArr.length - 1];
  const [configs] = useStore('configs');

  const currentConfig = useMemo(() => {
    if (configs) {
      return configs.find((item: any) => item?.web_router === monitor);
    }
    return {};
  }, [monitor, configs]);

  const supportFetchData = currentConfig.dashboard_id === '1' || currentConfig.dashboard_id === '2';

  const { data, isFetching } = useQuery(
    ['fetchGpuNode'],
    async () => {
      return request.get('/kapis/aicp.kubesphere.io/v1/gpu/list_gpu_dev_info').then(res => {
        if ((res as any)?.ret_code === 0) {
          return res?.data ?? {};
        }
      });
    },
    {
      enabled: supportFetchData,
    },
  );

  const url = useMemo(() => {
    const defaultHost = currentConfig?.grafana_address;
    // eslint-disable-next-line max-len
    const baseUrl = `http://${defaultHost}/d/${currentConfig?.dashboard_url_path}/${currentConfig?.web_router}?orgId=1`;
    const configUrl = `${currentConfig?.grafana_params}&theme=light&refresh=10s`;
    const nodeSet = new Set<string>([]);
    if (supportFetchData) {
      data?.forEach((item: any) => {
        if (item?.gpu_node_id) {
          const id: string = item?.gpu_node_id ?? '';
          nodeSet.add(id);
        }
      });
      return `${baseUrl}${Array.from(nodeSet)
        .map(item => `&var-Hostname=${item}`)
        .join('')}${configUrl}`;
    }
    return `${baseUrl}${configUrl}`;
  }, [data, currentConfig, supportFetchData]);

  if (!currentConfig?.grafana_address || !currentConfig?.dashboard_url_path) {
    return (
      <EmptyTip>
        <Warning size={30} />
        请先配置grafana地址！
      </EmptyTip>
    );
  }

  return (
    <Wrap>
      {(isFetching || !currentConfig) && <Loading className="page-loading" />}
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
      />
    </Wrap>
  );
}

export default Dashboard;
