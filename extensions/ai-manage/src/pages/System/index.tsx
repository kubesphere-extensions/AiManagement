import React from 'react';
import { Button, Card, LoadingOverlay } from '@kubed/components';
import { Hammer } from '@kubed/icons';
import { useQuery } from 'react-query';
import { request } from '@ks-console/shared';
import { useStore } from '@kubed/stook';

import Item from './item';
import { Header, ConfigWrap, FlexCenter } from './styles';
function System(): JSX.Element {
  const [, setConfigs] = useStore('configs');
  const { data, isLoading } = useQuery(['dashboard_config', []], (): Promise<any> => {
    const url = '/kapis/aicp.kubesphere.io/v1/gpu/list_gpu_dashboard_config';

    return request(url).then(res => {
      if ((res as any)?.ret_code === 0) {
        const result = res?.data ?? [];
        setConfigs(result);
        return result;
      }
    });
  });

  return (
    <div>
      <LoadingOverlay visible={isLoading} />
      <Card className="mb12">
        <Header>
          <FlexCenter gap="10px">
            <Hammer size={40} />
            <div>
              <div className="title">监控管理</div>
              <div className="desc">配置监控地址、页面展示</div>
            </div>
          </FlexCenter>
          <Button
            color="primary"
            onClick={() => {
              window.location.reload();
            }}
          >
            同步配置
          </Button>
        </Header>
        <ConfigWrap>
          {data?.map((item: any) => (
            <Item key={item.dashboard_id} config={item} />
          ))}
        </ConfigWrap>
      </Card>
    </div>
  );
}

export default System;
