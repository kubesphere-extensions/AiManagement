import React from 'react';
import { Link } from 'react-router-dom';
import { isEmpty, get } from 'lodash';

import { Tooltip, Field } from '@kubed/components';
import {
  Column,
  StatusIndicator,
  getNodeStatus,
  getDisplayName,
} from '@ks-console/shared';
import { Nodes } from '@kubed/icons';

import { FieldLabel, Taints } from '../../../NodeManage/Tables/styles';

const renderTaintsTip = (data: Record<string, string>[]) => (
  <div>
    <div>{t('TAINTS')}:</div>
    <div>
      {data.map(item => {
        const text = `${item.key}=${item.value || ''}:${item.effect}`;
        return (
          <div style={{ wordBreak: 'break-all' }} key={text}>
            {text}
          </div>
        );
      })}
    </div>
  </div>
);

const getColumns = (listData: any, cluster: string): Column[] => [
  {
    title: t('Node Name'),
    field: 'name',
    searchable: true,
    sortable: true,
    render: (value, row) => (
      <Field
        value={(
          <Link to={`/ai-manage/${cluster}/nodes/master3`}>
            {getDisplayName(row)}
          </Link>
        )}
        avatar={<Nodes size={40} />}
        label={<FieldLabel>{row.ip || '-'}</FieldLabel>}
      />
    ),
  },
  {
    title: t('STATUS'),
    field: 'status',
    canHide: true,
    render: (value, row) => {
      const taints = row.taints;
      const status = getNodeStatus(row);

      return (
        <div>
          <StatusIndicator type={status}>
            {t(`NODE_STATUS_${status.toUpperCase()}`)}
          </StatusIndicator>
          {!isEmpty(taints) && row.importStatus === 'success' && (
            <Tooltip content={renderTaintsTip(taints)}>
              <Taints>{taints.length}</Taints>
            </Tooltip>
          )}
        </div>
      );
    },
  },
  {
    title: t('ROLE'),
    field: 'role',
    canHide: true,
    render: roles => (roles.indexOf('master') === -1 ? t('WORKER') : t('CONTROL_PLANE')),
  },
  {
    title: t('CPU Model'),
    field: 'node_cpu_model',
    canHide: true,
    render: (_v, row) => get(listData, [row.name, 'node_cpu_model'], '-'),
  },
  {
    title: t('CPU cores'),
    field: 'node_cpu',
    canHide: true,
    render: (_v, row) => {
      const value = get(listData, [row.name, 'node_cpu']);
      return value ? `${value} ${t('Core')}` : '-';
    },
  },
  {
    title: t('Memory'),
    field: 'node_memory',
    canHide: true,
    render: (_v, row) => {
      const value = get(listData, [row.name, 'node_memory']);
      return value ? `${value}G` : '-';
    },
  },
  {
    title: t('Compute IB Network Card Configuration'),
    field: 'node_ib_bw_compute',
    canHide: true,
    render: (_v, row) => {
      const value = get(listData, [row.name, 'node_ib_bw_compute']);
      return value ? `${value}G` : '-';
    },
  },
  {
    title: t('Number of Compute IB Network Cards'),
    field: 'node_ib_count_compute',
    render: (_v, row) => get(listData, [row.name, 'node_ib_count_compute'], '-'),
  },
  {
    title: t('Storage IB Network Card Configuration'),
    field: 'node_ib_bw_storage',
    canHide: true,
    render: (_v, row) => {
      const value = get(listData, [row.name, 'node_ib_bw_storage']);
      return value ? `${value}G` : '-';
    },
  },
  {
    title: t('Number of Storage IB Network Cards'),
    field: 'node_ib_count_storage',
    canHide: true,
    render: (_v, row) => {
      const value = get(listData, [row.name, 'node_ib_count_storage']);
      return value ? `${value}G` : '-';
    },
  },
];

export default getColumns;