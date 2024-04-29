import React from 'react';

import { Modal } from '@kubed/components';
import { request } from '@ks-console/shared';

import NodeSelectors from './create/node-form';

interface Props {
  pool: Pool;
  onClose: (refresh?: boolean) => void;
};

const AddNodes = ({ pool, onClose }: Props) => {
  const [loading, setLoading] = React.useState(false);

  /**
   * 表单提交
   * @param params
   * @returns
   */
  const onSubmit = async (nodes: string[]) => {
    setLoading(true);

    const res: any = await request.post('/kapis/aicp.kubesphere.io/v1/resource_pool/add_node', {
      nodes,
      pool_id: pool.pool_id,
    });

    if (res?.ret_code) {
      return setLoading(false);
    }

    onClose(true);
  };

  return (
    <Modal
      title={t('Add nodes')}
      width={700}
      footer={null}
      onCancel={() => onClose()}
      visible
    >
      <NodeSelectors
        loading={loading}
        onSubmit={onSubmit}
        onCancel={() => onClose()}
        parameters={{
          labelSelector: '!aicp.group/aipods_type',
        }}
        okText="ADD"
      />
    </Modal>
  );
};

export default AddNodes;
