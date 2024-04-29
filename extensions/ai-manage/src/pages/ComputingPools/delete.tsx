import React from 'react';

import { notify } from '@kubed/components';
import { DeleteConfirmModal, request } from '@ks-console/shared';

interface Props {
  pool: Pool;
  onClose: (refresh?: boolean) => void;
};

const DeleteModal = ({ pool, onClose }: Props) => {
  const [loading, setLoading] = React.useState(false);

  const onDelete = async () => {
    setLoading(true);

    const res: any = await request.delete('/kapis/aicp.kubesphere.io/v1/resource_pool', {
      params: {
        pool_id: pool.pool_id,
      }
    });

    if (res?.ret_code) {
      notify.error(res?.message);
      return setLoading(false);
    }

    onClose(true);
  };

  return (
    <DeleteConfirmModal
      title={t('Delete pool')}
      tip={t('Confirm to delete pool {items} ?', {
        items: pool.pool_name,
      })}
      onOk={onDelete}
      onCancel={() => onClose()}
      confirmLoading={loading}
      visible
    />
  );
};

export default DeleteModal;
