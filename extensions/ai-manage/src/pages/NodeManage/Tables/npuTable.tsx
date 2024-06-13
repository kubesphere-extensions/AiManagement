import React from 'react';
import { Field } from '@kubed/components';
import { Nodes } from '@kubed/icons';
import { Link } from 'react-router-dom';
import { StatusIndicator } from '@ks-console/shared';
import { toPercentage } from './contants';
import { FieldLabel, Resource } from '../style';
import { DataTable, Column } from '../../../components/DataTable';
import ResourceLink from '../../../components/ResourceLink';
import { NumDanger } from './styles';

interface StatusMap {
  [key: string]: string;
}

interface Props {
  renderTabs: () => React.ReactNode;
}

const statusMap: StatusMap = {
  '0': 'Normal',
  '2': 'Abnormal',
  '1': 'Unknown',
};

function NpuTable({ renderTabs }: Props) {
  const columns: Column[] = [
    {
      title: t('Node Name'),
      field: 'search_word',
      searchable: true,
      sortable: false,
      rowSpan: true,
      width: 200,
      fixed: 'left',
      render: (_v, row) => (
        <Field
          value={<Link to={row?.npu_node_id}>{row?.npu_node_id ?? '-'}</Link>}
          avatar={<Nodes size={40} />}
          label={<FieldLabel>{row.npu_node_ip || '-'}</FieldLabel>}
        />
      ),
    },
    {
      title: t('状态'),
      field: 'npu_node_status',
      canHide: true,
      rowSpan: true,
      width: 100,
      fixed: 'left',
      render: value => {
        const status = value === 'Ready' ? 'Running' : 'Warning';
        return (
          <StatusIndicator type={status}>
            {t(`NODE_STATUS_${status?.toUpperCase()}`)}
          </StatusIndicator>
        );
      },
    },
    {
      title: t('Belonging Compute Pool'),
      field: 'npu_node_compute_group',
      canHide: true,
      rowSpan: true,
      width: 120,
      fixed: 'left',
      render: v => <ResourceLink type="pool" id={v} />,
    },
    {
      title: t('NPU 状态 / 网卡数'),
      field: 'npu_status',
      canHide: true,
      rowSpan: true,
      width: 120,
      fixed: 'left',
      render: (value, row) => {
        const status = statusMap?.[value] ?? 'Unknown';
        const type = +value === 0 ? 'Running' : +value === 2 ? 'Error' : 'Warning';
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StatusIndicator type={type}>{t(status)}</StatusIndicator>
            <span> &nbsp;/ {row?.machine_npu_nums || '-'}</span>
          </div>
        );
      },
    },
    {
      title: t('VDIE_ID / MODEL_NAME / PCIE'),
      field: 'npu_uuid',
      canHide: true,
      render: (v, row) => (
        <Field
          label={<Resource>{`${row?.model_name || '-'} / ${row?.pcie_bus_info || '-'}`}</Resource>}
          value={v || '-'}
        />
      ),
    },
    {
      title: t('处理器'),
      field: 'npu_chip_info_health_status',
      canHide: true,
      render: (value: string) => {
        const type = +value === 1 ? 'Running' : 'Error';
        return (
          <div>
            <StatusIndicator type={type}></StatusIndicator>
          </div>
        );
      },
    },
    {
      title: t('网口'),
      field: 'npu_chip_info_link_status',
      canHide: true,
      render: (value: string) => {
        const type = +value === 1 ? 'Running' : 'Error';
        return (
          <div>
            <StatusIndicator type={type}></StatusIndicator>
          </div>
        );
      },
    },
    {
      title: t('网络'),
      field: 'npu_chip_info_network_status',
      canHide: true,
      render: (value: string) => {
        const type = +value === 1 ? 'Running' : 'Error';
        return (
          <div>
            <StatusIndicator type={type}></StatusIndicator>
          </div>
        );
      },
    },
    {
      title: t('错误码'),
      field: 'npu_chip_info_error_code',
      canHide: true,
      render: (value: string) => {
        if (+value) {
          return <NumDanger>{value}</NumDanger>;
        }
        return value;
      },
    },
    {
      title: t('Core 利用率'),
      field: 'npu_chip_info_utilization',
      canHide: true,
      render: value => {
        return (
          <Field
            value={
              <Resource>
                <span>{value}%</span>
              </Resource>
            }
          />
        );
      },
    },
    {
      title: t('容器 NPU 利用率'),
      field: 'container_npu_utilization',
      canHide: true,
      render: value => {
        return (
          <Field
            value={
              <Resource>
                <span>{value}%</span>
              </Resource>
            }
          />
        );
      },
    },
    {
      title: t('命名空间'),
      field: 'exported_namespace',
      render: value => (value ? value : '-'),
    },
    {
      title: t('POD'),
      field: 'pod_name',
      render: (value, row) => (
        <ResourceLink type="pod" id={value} namespace={row?.exported_namespace} />
      ),
    },
    {
      title: t('DDR 剩余内存'),
      field: 'npu_chip_info_total_memory',
      canHide: true,
      render: (value, row) => {
        if (+row?.dev_gpu_status === 2) {
          return '-';
        }
        const v = (+value || 0) - (+row?.npu_chip_info_used_memory || 0);
        return (
          <Field
            value={<Resource>{`${v.toFixed(2)} MB`}</Resource>}
            label={`${row?.npu_chip_info_used_memory}/${value || 0} MB`}
          />
        );
      },
    },
    {
      title: t('HBM 剩余内存'),
      field: 'npu_chip_info_hbm_total_memory',
      canHide: true,
      render: (value, row) => {
        if (+row?.dev_gpu_status === 2) {
          return '-';
        }
        const v = (+value || 0) - (+row?.npu_chip_info_hbm_used_memory || 0);
        return (
          <Field
            value={<Resource>{`${v.toFixed(2)} MB`}</Resource>}
            label={`${row?.npu_chip_info_hbm_used_memory}/${value || 0} MB`}
          />
        );
      },
    },
  ];

  const formatServerData = (serverData: Record<string, any>) => {
    const data = serverData?.data || [];
    const dataGroup = new Map();

    // 合并数据，处理单元格合并
    data.forEach((item: any) => {
      if (dataGroup.has(item.npu_node_id)) {
        const group = dataGroup.get(item.npu_node_id);
        if (group[0].rowspan) {
          group[0].rowspan++;
        }
        group.push(item);
      } else {
        dataGroup.set(item.npu_node_id, [{ ...item, rowspan: 1 }]);
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
      tableName="npu_table"
      rowKey="npu_uuid"
      url="/kapis/aicp.kubesphere.io/v1/gpu/list_npu_dev_info"
      toolbarLeft={renderTabs()}
      columns={columns}
      serverDataFormat={formatServerData}
      showFooter={false}
    />
  );
}

export default NpuTable;
