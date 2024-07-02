import React, { useState, useCallback, useEffect } from 'react';
import { Switch } from '@kubed/components';
import { request } from '@ks-console/shared';
import { useMutation } from 'react-query';
import { debounce } from 'lodash';

import Field from './field';
import ModifyInput from './modify-input';
import { ConfigItem, FlexCenter, ItemTitleWrap } from './styles';

const TabName = {
  '1': 'GPU 监控',
  '3': 'NPU 监控',
  '4': '网卡监控',
  '6': 'vGPU 监控',
};

function Item({ config }: any): JSX.Element {
  const [enable, setEnable] = useState(config?.enable_dashboard === '1');
  const [enableTab, setEnableTab] = useState(config?.enable_table_view === '1');

  const { mutate } = useMutation(
    (fetchParams: any) => {
      const url = '/kapis/aicp.kubesphere.io/v1/gpu/update_gpu_dashboard_config?';
      // eslint-disable-next-line max-len
      const params = `${url}dashboard_id=${config?.dashboard_id}&${fetchParams}`;
      return request.post(params);
    },
    {
      onSuccess: () => {},
    },
  );

  const senRequest = useCallback(
    debounce((params: string) => {
      mutate(params);
    }, 1000),
    [],
  );

  const handleModifyName = (name: string) => {
    const params = `dashboard_name=${name}`;
    mutate(params);
  };

  const handleModifyAddress = (name: string) => {
    const params = `grafana_address=${name}`;
    mutate(params);
  };

  const handleModifyUid = (name: string) => {
    const params = `uid=${name}`;
    mutate(params);
  };

  const handleModifyRouter = (name: string) => {
    const params = `template=${name}`;
    mutate(params);
  };

  const handleModifyParams = (name: string) => {
    const params = `grafana_params=${encodeURIComponent(name)}`;
    mutate(params);
  };

  const handleToggleNav = (v: boolean) => {
    const val = v ? '1' : '0';
    setEnable(v);
    senRequest(`enable_dashboard=${val}`);
  };

  const handleToggleTab = (v: boolean) => {
    const val = v ? '1' : '0';
    setEnableTab(v);
    senRequest(`enable_table_view=${val}`);
  };

  useEffect(() => {
    setEnable(config?.enable_dashboard === '1');
    setEnableTab(config?.enable_table_view === '1');
  }, [config]);

  return (
    <>
      <ItemTitleWrap>
        <FlexCenter gap="20px">
          <ModifyInput defaultValue={config?.dashboard_name} onSubmit={handleModifyName} />
          <Field label="">
            <Switch okText="开" offText="关" checked={enable} onChange={handleToggleNav} />
          </Field>
          {TabName?.[config?.dashboard_id as '1'] && (
            <Field label={`节点管理的<${TabName?.[config?.dashboard_id as '1']}>`}>
              <Switch okText="开" offText="关" checked={enableTab} onChange={handleToggleTab} />
            </Field>
          )}
        </FlexCenter>
      </ItemTitleWrap>
      <ConfigItem>
        <FlexCenter gap="10px 20px">
          <Field label="Grafana 地址">
            <ModifyInput
              defaultValue={config?.grafana_address}
              onSubmit={handleModifyAddress}
              haveBg
            />
          </Field>
          <Field label="Grafana UID">
            <ModifyInput
              defaultValue={config?.dashboard_url_path}
              onSubmit={handleModifyUid}
              haveBg
            />
          </Field>
          <Field label="Dashboard 名称">
            <ModifyInput defaultValue={config?.web_router} onSubmit={handleModifyRouter} haveBg />
          </Field>
          <Field label="Grafana Url 参数">
            <ModifyInput
              defaultValue={config?.grafana_params}
              onSubmit={handleModifyParams}
              haveBg
            />
          </Field>
        </FlexCenter>
      </ConfigItem>
    </>
  );
}

export default Item;
