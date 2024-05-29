import React from 'react';
import { Link } from 'react-router-dom';

import { Add, Substract, Pen, Trash, Resource, More } from '@kubed/icons';
import { Field, Button, Dropdown, Menu, MenuItem } from '@kubed/components';
import { Column, DataTable, request, formatTime, type TableRef } from '@ks-console/shared';

import CreateModal from './create';
import EditModal from './edit';
import AddNodes from './add-nodes';
import RemoveNodes from './remove-nodes';
import DeleteModal from './delete';

const getColumns = (aiPodFilters: AiPodFilter[]): Column<Pool>[] => [
  {
    title: `${t('Name')}/ID`,
    field: 'pool_name',
    render: (pool_name, row) => (
      <Field
        label={row?.pool_id ?? pool_name}
        value={<Link to={row?.pool_id}>{pool_name}</Link>}
        avatar={<Resource size={40} />}
      />
    ),
  },
  {
    title: t('AIpods type'),
    field: 'aipods_type',
    render: value => {
      if (!value) return '-';
      if (!aiPodFilters?.length) return value;

      const aiPod = aiPodFilters.find((filter) => filter.attr_value === value);
      return aiPod?.name ?? '-';
    },
    canHide: true,
  },
  {
    title: t('Node counts'),
    field: 'node_count',
    render: value => (value ?? '-'),
    canHide: true,
  },
  {
    title: t('GPU counts'),
    field: 'gpu_count',
    render: value => (value ?? '-'),
    canHide: true,
  },
  {
    title: t('Description'),
    field: 'description',
    render: value => (value ?? '-'),
    canHide: true,
  },
  {
    title: t('Create time'),
    field: 'created_at',
    render: value => value ? formatTime(value) : '-',
    canHide: true,
  },
];

const MoreActions = ({ row, onClick }: {
  row: Pool, onClick: (key: string, row: Pool) => void
}) => (
  <Menu>
    <MenuItem
      icon={<Add />}
      onClick={() => onClick('add', row)}
    >
      {t('Add nodes')}
    </MenuItem>
    <MenuItem
      icon={<Substract />}
      disabled={!row?.node_count}
      onClick={() => !!row?.node_count && onClick('remove', row)}
    >
      {t('Remove nodes')}
    </MenuItem>
    <MenuItem
      icon={<Pen />}
      onClick={() => onClick('edit', row)}
    >
      {t('Edit pool')}
    </MenuItem>
    <MenuItem
      icon={<Trash />}
      // disabled={!!row.node_count}
      onClick={() => onClick('delete', row)}
    >
      {t('Delete pool')}
    </MenuItem>
  </Menu>
);

const formatServerData = (serverData: Record<string, any>) => ({
  items: serverData?.data || [],
  totalItems: serverData?.counts,
});

const EntryList = () => {
  const ref = React.useRef<TableRef>(null);

  const [visible, setVisible] = React.useState('');
  const [pool, setPool] = React.useState<Pool>();
  const [aiPodFilters, setAiPodFilters] = React.useState<AiPodFilter[]>([]);

  React.useEffect(() => {
    request.get('/kapis/aicp.kubesphere.io/v1/resource_pool/aipod_type').then(res => {
      const attributes = (res as any)?.attributes ?? [];
      const filters = attributes[0]?.filters ?? [];

      setAiPodFilters(filters);
    });
  }, []);

  const onClose = (refetch?: boolean) => {
    setVisible('');
    setPool(undefined);

    refetch && ref?.current?.refetch();
  };

  const onClickAction = (key: string, row: Pool) => {
    setPool(row);
    setVisible(key);
  };

  const columns = React.useMemo(() => {
    const _columns: Column<Pool>[] = getColumns(aiPodFilters);

    return [
      ..._columns,
      {
        title: '',
        field: 'pool_id',
        // @ts-ignore
        render: (_, row) => (
          <Dropdown content={<MoreActions row={row} onClick={onClickAction} />}>
            <Button variant="text"><More /></Button>
          </Dropdown>
        ),
        width: 120,
      },
    ]
  }, [aiPodFilters]);

  const optionModal = React.useMemo(() => {
    if (visible === 'create') {
      return <CreateModal aiPodFilters={aiPodFilters} onClose={onClose} />;
    }

    if (!pool) return null;

    if (visible === 'add') {
      return <AddNodes pool={pool} onClose={onClose} />;
    }

    if (visible === 'remove') {
      return <RemoveNodes pool={pool} onClose={onClose} />;
    }

    if (visible === 'edit') {
      return <EditModal pool={pool} onClose={onClose} />;
    }

    if (visible === 'delete') {
      return <DeleteModal pool={pool} onClose={onClose} />;
    }

    return null;
  }, [visible, pool, aiPodFilters, onClose]);

  return (
    <>
      <DataTable
        ref={ref}
        rowKey="dev_gpu_uuid"
        tableName="gpu_table"
        url="/kapis/aicp.kubesphere.io/v1/resource_pool"
        columns={columns}
        serverDataFormat={formatServerData}
        toolbarRight={(
          <Button color="secondary" onClick={() => setVisible('create')} shadow>
            {t('Create computing pools')}
          </Button>
        )}
        hideFilters
      />
      {optionModal}
    </>
  );
};

export default EntryList;
