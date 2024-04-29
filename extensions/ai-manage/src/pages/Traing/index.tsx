import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Banner, notify } from '@kubed/components';
import { Topology } from '@kubed/icons';
import { get } from 'lodash';
import {
  DataTable,
  TableRef,
  Column,
  formatTime,
  StatusIndicator,
  transformRequestParams,
} from '@ks-console/shared';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Field } from '@kubed/components';
import { Copy } from '@kubed/icons';

import { formatDuration, capitalizeFirstLetter } from '../../utils';
import { FieldLabel, ResourceId } from './styles';

const STATUS_MAP = [
  'ALL',
  'PENDING',
  'CREATING',
  'CREATED',
  'RUNNING',
  'SUCCEEDED',
  'FAILED',
  'SUSPENDED',
  'TERMINATING',
  'TERMINATED',
];

const getColumns = (): Column[] => {
  const getStatusSelectOption = () => {
    return STATUS_MAP.map(key => ({
      label: t(key),
      key: key === 'ALL' ? undefined : capitalizeFirstLetter(key.toLocaleLowerCase()),
    }));
  };

  const handleCopy = () => {
    notify.success(t('Copied to clipboard'));
  };

  return [
    {
      title: t('Task Name / ID'),
      field: 'name',
      searchable: true,
      canHide: true,
      render: (_v, row) => (
        <Field
          value={<FieldLabel>{row.name || '-'} </FieldLabel>}
          label={
            <ResourceId>
              {/* <Link to={`/ai-manage/host/training/${row?.uuid}`}>{row?.uuid ?? '-'} </Link> */}
              <Link to="">{row?.uuid ?? '-'} </Link>
              <CopyToClipboard text={row?.uuid} onCopy={handleCopy}>
                <span className="copy">
                  <Copy />
                </span>
              </CopyToClipboard>
            </ResourceId>
          }
        />
      ),
    },
    {
      title: t('Task Status'),
      field: 'status',
      searchable: true,
      filterOptions: getStatusSelectOption(),
      canHide: true,
      render: v => <StatusIndicator type={v}>{t(`${v.toUpperCase()}`)}</StatusIndicator>,
    },
    {
      title: t('Image'),
      field: 'image',
      canHide: true,
      render: v => v || '-',
    },
    {
      title: t('Creation time'),
      field: 'created_at',
      canHide: true,
      sortable: true,
      render: v => (v ? formatTime(v) : '-'),
    },
    {
      title: t('Start time'),
      field: 'running_at',
      canHide: true,
      sortable: true,
      render: v => (v ? formatTime(v) : '-'),
    },
    {
      title: t('End time'),
      field: 'ended_at',
      sortable: true,
      canHide: true,
      render: v => (v ? formatTime(v) : '-'),
    },
    {
      title: t('Running time'),
      field: 'running_time',
      canHide: true,
      render: v => (v ? formatDuration(v * 1000) : '-'),
    },
    {
      title: t('Submitter information'),
      field: 'user_id',
      canHide: true,
      render: v => v || '-',
    },
  ];
};

function Training() {
  const tableRef = useRef<TableRef>();

  const columns = getColumns();

  const formatServerData = (serverData: Record<string, any>) => {
    return {
      items: get(serverData, 'data', []),
      totalItems: get(serverData, 'counts', 0),
    };
  };

  const handleTransformRequestParams = (params: any) => {
    const sortBy = get(params.sortBy, [0], {});
    const sortParams = {
      order_by: sortBy?.id !== 'createTime' ? sortBy?.id : undefined,
      reverse: sortBy?.id !== 'createTime' ? sortBy?.desc : undefined,
    };
    const p = transformRequestParams(params);
    return {
      ...p,
      ascending: undefined,
      sortBy: undefined,
      offset: ((p?.page ?? 1) - 1) * (p?.limit ?? 10),
      ...sortParams,
    };
  };

  return (
    <div>
      <Banner
        className="mb12"
        icon={<Topology />}
        title={t('Distributed training')}
        description={t('Distributed Desc')}
      />
      <DataTable
        ref={tableRef}
        tableName="trains"
        rowKey="uuid"
        placeholder={t('Please enter the task name to search')}
        url="/kapis/aicp.kubesphere.io/v1/trains/namespaces/ALL/trains"
        transformRequestParams={handleTransformRequestParams}
        columns={columns}
        serverDataFormat={formatServerData}
        emptyOptions={{
          withoutTable: true,
          image: <Topology size={48} />,
          title: t('No distributed training tasks found'),
        }}
      />
    </div>
  );
}

export default Training;
