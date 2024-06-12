import React from 'react';
import { Field } from '@kubed/components';
import { Nodes } from '@kubed/icons';
import { Link } from 'react-router-dom';
import { StatusIndicator } from '@ks-console/shared';
import { DataTable, Column } from '../../../components/DataTable';
import ResourceLink from '../../../components/ResourceLink';
import { FieldLabel } from '../style';

interface StatusMap {
  [key: string]: string;
}

interface Props {
  renderTabs: () => React.ReactNode;
}

const statusMap: StatusMap = {
  '5': 'Normal',
  '3': 'Abnormal',
  '0': 'Unknown',
};

function ListTable({ renderTabs }: Props) {
  const columns: Column[] = [
    {
      title: t('Node Name'),
      field: 'search_word',
      searchable: true,
      sortable: false,
      rowSpan: true,
      render: (_v, row) => (
        <Field
          value={<Link to={row?.gpu_node_id}>{row?.gpu_node_id ?? '-'}</Link>}
          avatar={<Nodes size={40} />}
          label={<FieldLabel>{row.gpu_node_ip || '-'}</FieldLabel>}
        />
      ),
    },
    {
      title: t('STATUS'),
      field: 'gpu_node_status',
      canHide: true,
      rowSpan: true,
      render: value => {
        const status = value === 'Ready' ? 'Running' : 'Warning';
        return (
          <div>
            <StatusIndicator type={status}>
              {t(`NODE_STATUS_${status?.toUpperCase()}`)}
            </StatusIndicator>
          </div>
        );
      },
    },
    {
      title: t('Belonging Compute Pool'),
      field: 'gpu_node_compute_group',
      canHide: true,
      rowSpan: true,
      render: v => <ResourceLink type="pool" id={v} />,
    },
    {
      title: t('IB 卡数量'),
      field: 'device_num',
      canHide: true,
      rowSpan: true,
      render: v => v || '-',
    },
    {
      title: t('计算 IB 卡'),
      field: 'ib_bw_compute',
      canHide: true,
      rowSpan: true,
      render: (v, row) => (
        <Field label={v ? `${v} Gb/s` : '-'} value={row.ib_count_compute || '-'} />
      ),
    },
    {
      title: t('存储 IB 卡'),
      field: 'ib_bw_storage',
      canHide: true,
      rowSpan: true,
      render: (v, row) => (
        <Field label={v ? `${v} Gb/s` : '-'} value={row.ib_count_storage || '-'} />
      ),
    },
    {
      title: t('IB 设备名称'),
      field: 'ib_device',
      canHide: true,
      render: value => (value ? value : '-'),
    },
    {
      title: t('IB 状态'),
      field: 'ib_status',
      canHide: true,
      render: (value: string) => {
        const status = statusMap?.[value] ?? 'Unknown';
        const type = +value === 5 ? 'Running' : +value === 3 ? 'Error' : 'Warning';
        return (
          <div>
            <StatusIndicator type={type}>{t(status)}</StatusIndicator>
          </div>
        );
      },
    },
    {
      title: t('HCA 类型'),
      field: 'ib_hca_type',
      render: value => (value ? value : '-'),
    },
    {
      title: t('IB 板卡号 / IB 固件版本'),
      field: 'ib_board_id',
      canHide: true,
      render: (_v, row) => (
        <Field value={row?.ib_board_id ?? '-'} label={row.ib_firmware_version || '-'} />
      ),
    },
    {
      title: t('故障率(5m)'),
      canHide: true,
      field: 'link_downed_rate',
      render: value => {
        return value ?? '-';
      },
    },
  ];

  const formatServerData = (serverData: Record<string, any>) => {
    const data = serverData?.data || [];
    const dataGroup = new Map();
    // 合并数据，处理单元格合并
    data.forEach((item: any) => {
      item.key = `${item.gpu_node_id}${item.ib_device}`;
      if (dataGroup.has(item.gpu_node_id)) {
        const group = dataGroup.get(item.gpu_node_id);
        if (group[0].rowspan) {
          group[0].rowspan++;
        }
        if (group[0]?.ib_device) {
          group[0].device_num++;
        }
        group.push(item);
      } else {
        dataGroup.set(item.gpu_node_id, [{ ...item, rowspan: 1, device_num: 1 }]);
      }
    });

    const newArray = Array.from(dataGroup.values());
    const result = [].concat(...newArray);

    return {
      items: result || [],
      totalItems: serverData?.counts,
    };
  };

  return (
    <DataTable
      tableName="ib_table"
      rowKey="key"
      url="/kapis/aicp.kubesphere.io/v1/gpu/list_ib_dev_info"
      toolbarLeft={renderTabs()}
      columns={columns}
      serverDataFormat={formatServerData}
    />
  );
}

export default ListTable;
