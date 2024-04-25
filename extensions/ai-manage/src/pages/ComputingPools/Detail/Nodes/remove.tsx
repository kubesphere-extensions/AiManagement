import React from 'react';

import { notify } from '@kubed/components';
import { DeleteConfirmModal, request } from '@ks-console/shared';

interface Props {
  pool: Pool;
  node_name: string;
  onClose: (refresh?: boolean) => void;
};

const RemoveNodes = ({ pool, node_name, onClose }: Props) => {
  const [loading, setLoading] = React.useState(false);

  const onDelete = async () => {
    setLoading(true);

    const res: any = await request.post('/kapis/aicp.kubesphere.io/v1/resource_pool/remove_node', {
      nodes: [node_name],
      pool_id: pool.pool_id,
    });

    if (res?.ret_code) {
      notify.error(res?.message);
      return setLoading(false);
    }

    onClose(true);
  };

  return (
    <DeleteConfirmModal
      title={t('Remove nodes')}
      tip={t('Confirm to remove node {items} ?', {
        items: node_name,
      })}
      onOk={onDelete}
      onCancel={() => onClose()}
      confirmLoading={loading}
      visible
    />
  );
};

export default RemoveNodes;
