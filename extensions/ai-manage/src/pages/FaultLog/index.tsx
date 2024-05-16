import React, { useState, useRef } from 'react';
import { Nodes, More, Hammer } from '@kubed/icons';
import { Banner, Card, Field, Button, Dropdown, Menu, MenuItem } from '@kubed/components';
import { get } from 'lodash';
import { formatTime, StatusIndicator, TableRef } from '@ks-console/shared';
import { Link } from 'react-router-dom';
import { useDisclosure } from '@kubed/hooks';
import { DataTable, Column } from '../../components/DataTable';

import { FullRow, FullCol, StyledEntity, StyledField, FieldLabel } from './styles';
import { Waring } from '../../icons';
import TroubleshootingModal from './TroubleshootingModal';
import { getStrategy } from '../../utils';

function FaultLog() {
  const tableRef = useRef<TableRef>();
  const [unprocessed, setUnprocessed] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [id, setID] = useState('');
  const [status, setStatus] = useState<number | undefined>(undefined);
  const createModal = useDisclosure();

  const MoreActions = ({ row }: { row: any }) => {
    const handle = () => {
      if (row.fault_status === '1') return;
      createModal.open();
      setID(row?.records_id);
    };

    return (
      <Menu>
        <MenuItem icon={<Hammer />} onClick={handle} disabled={row.fault_status === '1'}>
          {t('Troubleshooting')}
        </MenuItem>
      </Menu>
    );
  };

  const columns: Column[] = [
    {
      title: t('Node Name'),
      field: 'gpu_node_id',
      sortable: false,
      // rowSpan: true,
      render: (_v, row) => (
        <Field
          value={
            <Link to={`/ai-manage/host/nodes/${row?.gpu_node_id}`}>{row?.gpu_node_id ?? '-'}</Link>
          }
          avatar={<Nodes size={40} />}
          label={<FieldLabel>{row.gpu_node_ip || '-'}</FieldLabel>}
        />
      ),
    },
    {
      title: t('Belonging Compute Pool'),
      field: 'gpu_node_compute_group',
      canHide: true,
      render: (v, row) => v || '共享计算池',
    },
    {
      title: t('Fault ID'),
      field: 'records_id',
    },
    {
      title: t('Fault Severity'),
      canHide: true,
      field: 'fault_priority',
      render: (v: string) => {
        const type = v === 'Critical' ? 'Warning' : v === 'Warning' ? 'ready' : 'error';
        return (
          <div>
            <StatusIndicator type={type}>{t(v)}</StatusIndicator>
          </div>
        );
      },
    },
    {
      title: t('Fault Time'),
      field: 'search_word',
      searchable: true,
      render: (_v: string, row: any) => (row?.created_at ? formatTime(row?.created_at) : '-'),
    },
    {
      title: t('GPU UUID'),
      field: 'dev_gpu_uuid',
      canHide: true,
      width: 200,
      render: v => v || '-',
    },
    {
      title: t('Error Code'),
      field: 'gpu_err_id',
      canHide: true,
      render: v => v || '-',
    },
    {
      title: t('XID'),
      canHide: true,
      field: 'gpu_xid',
      render: v => v ?? '-',
    },
    {
      title: t('Error Description'),
      field: 'gpu_err_desc',
      canHide: true,
      width: 200,
      render: v => v || '-',
    },
    {
      title: t('Fault Status'),
      canHide: true,
      field: 'fault_status',
      render: (v: string) => (
        <StatusIndicator type={v === '1' ? 'ready' : 'deleted'}>
          {v === '1' ? t('Processed') : t('Unprocessed')}
        </StatusIndicator>
      ),
    },
    {
      title: t('故障策略'),
      field: 'gpu_err_strategy',
      canHide: true,
      render: v => (v ? getStrategy(v) : '-'),
    },
    {
      title: t('Fault Resolution'),
      field: 'fault_treatment',
      canHide: true,
      render: (value: string) => (value ? value : '-'),
    },
    {
      title: t('Fault Advice'),
      canHide: true,
      width: 200,
      field: 'gpu_suggestions',
      render: (v: string) => (v ? v : '-'),
    },
    {
      id: 'more',
      title: ' ',
      render: (_, row) => (
        <Dropdown placement="bottom-end" content={<MoreActions row={row} />}>
          <Button variant="text" radius="lg">
            <More size={16} />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const handleChangeStatus = (_status: number) => {
    if (_status === status) {
      setStatus(undefined);
      return;
    }
    setStatus(_status);
  };

  const changeProcessed = (data: any) => {
    setProcessed(data?.fault_treated ?? 0);
    setUnprocessed(data?.fault_untreated ?? 0);
  };

  const formatServerData = (serverData: Record<string, any>) => {
    const data = get(serverData, 'data[0]');

    changeProcessed(data);

    const dataGroup = new Map();

    // 合并数据，处理单元格合并
    data?.fault_records?.forEach((item: any) => {
      if (dataGroup.has(item.gpu_node_id)) {
        const group = dataGroup.get(item.gpu_node_id);
        if (group[0].rowspan) {
          group[0].rowspan++;
        }
        group.push(item);
      } else {
        dataGroup.set(item.gpu_node_id, [{ ...item, rowspan: 1 }]);
      }
    });
    const newArray = Array.from(dataGroup.values());
    const result = [].concat(...newArray);

    return {
      items: result || [],
      totalItems: data?.counts || 0,
      other: data,
    };
  };

  return (
    <div>
      <Banner
        className="mb12"
        icon={<Waring />}
        title={t('Fault Log')}
        description={t('Fault Desc')}
      />
      <Card className="mb12">
        <StyledEntity bordered={false}>
          <FullRow>
            <FullCol span={3}>
              <StyledField
                active={status === 0}
                avatar={<Waring size={40} />}
                label={t('Unprocessed')}
                value={unprocessed}
                onClick={() => handleChangeStatus(0)}
              />
            </FullCol>
            <FullCol span={8}>
              <StyledField
                active={status === 1}
                label={t('Processed')}
                value={processed}
                onClick={() => handleChangeStatus(1)}
              />
            </FullCol>
          </FullRow>
        </StyledEntity>
      </Card>
      <DataTable
        ref={tableRef}
        tableName="record"
        rowKey="records_id"
        placeholder={t('Fault placeholder')}
        url="/kapis/aicp.kubesphere.io/v1/gpu/list_gpu_fault_record"
        parameters={{ fault_status: status }}
        columns={columns}
        serverDataFormat={formatServerData}
        simpleSearch
        emptyOptions={{
          withoutTable: true,
          image: <Waring size={48} />,
          title: t('No record of faults found'),
        }}
        showFooter={false}
      />
      <TroubleshootingModal
        faultID={id}
        onCancel={() => createModal.close()}
        visible={createModal.isOpen}
        onSuccess={() => {
          tableRef.current?.refetch();
          createModal.close();
        }}
      />
    </div>
  );
}

export default FaultLog;
