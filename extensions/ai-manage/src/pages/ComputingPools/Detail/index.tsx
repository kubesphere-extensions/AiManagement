import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Resource, Add, Pen, Trash } from '@kubed/icons';
import { notify } from '@kubed/components';
import { request, DetailPagee, formatTime } from '@ks-console/shared';

import EditModal from '../edit';
import DeleteModal from '../delete';
import { DetailPageContext } from './provider';

function PoolDetail() {
  const navigate = useNavigate();
  const { pool_id, cluster } = useParams();

  const [pool, setPool] = React.useState<Pool>();
  const [visible, setVisible] = React.useState('');
  const [aiPodFilters, setAiPodFilters] = React.useState<AiPodFilter[]>([]);

  const getPool = async () => {
    const res: any = await request.get('/kapis/aicp.kubesphere.io/v1/resource_pool');

    if (res?.ret_code) {
      return notify.error(res?.message || t('Server error'));
    }

    setPool(res?.data?.find((item: Pool) => item.pool_id === pool_id));
  };

  React.useEffect(() => {
    getPool();

    request.get('/kapis/aicp.kubesphere.io/v1/resource_pool/aipod_type').then(res => {
      const attributes = (res as any)?.attributes ?? [];
      const filters = attributes[0]?.filters ?? [];

      setAiPodFilters(filters);
    });
  }, []);

  const attributes = React.useMemo(() => {
    const aiPod = aiPodFilters?.find((item) => {
      return item.attr_value === pool?.aipods_type;
    });

    return [
      { label: t('ID'), value: pool?.pool_id ?? '-' },
      { label: t('AIpods type'), value: aiPod?.name ?? '-' },
      { label: t('Node counts'), value: pool?.node_count ?? '-' },
      { label: t('GPU counts'), value: pool?.gpu_count ?? '-' },
      { label: t('Description'), value: pool?.description || '-' },
      {
        label: t('Create time'),
        value: pool?.created_at ? formatTime(pool.created_at) : '-',
      },
    ]
  }, [pool, aiPodFilters]);

  const optionModal = React.useMemo(() => {
    if (!pool) return null;

    if (visible === 'edit') {
      return (
        <EditModal
          pool={pool}
          onClose={(refresh) => {
            setVisible('');
            refresh && getPool();
          }}
        />
      );
    }

    if (visible === 'delete') {
      return (
        <DeleteModal
          pool={pool}
          onClose={(refresh) => {
            refresh ? navigate(`/ai-manage/${cluster}/pools`) : setVisible('');
          }}
        />
      );
    }

    return null;
  }, [visible, pool, setVisible]);

  return (
    <DetailPageContext.Provider value={{ pool, getPool }}>
      <DetailPagee
        tabs={[{ title: t('Node Manage'), path: 'nodes' }]}
        cardProps={{
          name: pool?.pool_name ?? '-',
          actions: [
            {
              key: 'edit',
              icon: <Pen />,
              text: t('Edit pool'),
              onClick: () => setVisible('edit'),
            },
            {
              key: 'delete',
              icon: <Trash />,
              text: t('Delete pool'),
              onClick: () => setVisible('delete'),
              props: {
                color: 'error'
              }
            },
          ],
          attrs: attributes,
          icon: <Resource size={28} />,
          breadcrumbs: {
            label: t('Computing pools manage'),
            url: `/ai-manage/${cluster}/pools`,
          },
        }}
      />
      {optionModal}
    </DetailPageContext.Provider>
  );
};

export default PoolDetail;
