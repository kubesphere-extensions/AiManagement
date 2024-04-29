import React from 'react';

import { request } from '@ks-console/shared';
import { Modal, notify } from '@kubed/components';

import NodeSelectors from './node-form';
import CreateSteps from '../../../components/Steps';
import BaseForm, { type BasePool } from './base-form';

interface Props {
  onClose: (refresh?: boolean) => void;
  aiPodFilters: AiPodFilter[];
};

const CreateModal = ({ aiPodFilters, onClose }: Props) => {
  const [current, setCurrent] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [params, setParams] = React.useState<BasePool>();

  /**
   * 提交基础信息
   * @param _params
   */
  const onSubmitBase = (_params: BasePool) => {
    setParams(_params);
    setCurrent(1);
  };

  /**
   * 表单提交
   * @param params
   * @returns
   */
  const onSubmit = async (node: string[]) => {
    setLoading(true);

    const res: any = await request.post('/kapis/aicp.kubesphere.io/v1/resource_pool', {
      node,
      ...params,
    });

    if (res?.ret_code) {
      notify.error(res?.message || t('Server error'));
      return setLoading(false);
    }

    onClose(true);
  };

  return (
    <Modal
      title={t('Create computing pools')}
      width={700}
      footer={null}
      onCancel={() => onClose()}
      visible
    >
      <CreateSteps
        steps={[
          { title: t('Base information'), icon: 'resource' },
          { title: t('Node configurations'), icon: 'nodes' },
        ]}
        current={current}
      />
      {
        current === 0 ? (
          <BaseForm
            params={params}
            aiPodFilters={aiPodFilters}
            onSubmit={onSubmitBase}
            onCancel={() => onClose()}
          />
        ) : (
          <NodeSelectors
            loading={loading}
            onSubmit={onSubmit}
            setCurrent={setCurrent}
            onCancel={() => onClose()}
            parameters={{
              labelSelector: '!aicp.group/aipods_type',
            }}
          />
        )
      }
    </Modal>
  );
};

export default CreateModal;
