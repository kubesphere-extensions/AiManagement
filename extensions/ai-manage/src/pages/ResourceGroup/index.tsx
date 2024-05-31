/* eslint-disable @typescript-eslint/naming-convention */
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Field, Banner, notify } from '@kubed/components';
import { get } from 'lodash';
import {
  TableRef,
  formatTime,
  StatusIndicator,
  transformRequestParams,
  Icon,
} from '@ks-console/shared';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy } from '@kubed/icons';
import { DataTable, Column } from '../../components/DataTable';

import { capitalizeFirstLetter } from '../../utils';
import { FieldLabel, ResourceId } from './styles';

const STATUS_MAP = ['ALL', 'PENDING', 'CREATING', 'RUNNING'];

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
      title: t('Inatance Name / ID'),
      field: 'name',
      searchable: true,
      canHide: true,
      fixed: 'left',
      width: 200,
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
      title: t('Status'),
      field: 'status',
      searchable: true,
      filterOptions: getStatusSelectOption(),
      canHide: true,
      render: v => <StatusIndicator type={v}>{t(`${v.toUpperCase()}`)}</StatusIndicator>,
    },
    {
      title: t('Computing configs'),
      field: 'replica_specs',
      canHide: true,
      render: (_, row) => {
        const {
          custom_cpu = '--',
          custom_memory = '--',
          custom_gpu = '--',
          custom_gpu_type = '',
          custom_gpu_memory = '--',
        } = row?.replica_specs as Record<string, any>;

        return (
          <Field
            label={
              <FieldLabel>
                {`
              ${custom_gpu_type} ${custom_gpu_memory || '--'}${custom_gpu_memory ? 'G' : ''} * ${
                  custom_gpu || '--'
                }${custom_gpu ? t('Core') : ''}`}
              </FieldLabel>
            }
            value={
              <FieldLabel black>{`${custom_cpu}${t('Core')} | ${custom_memory}G`} </FieldLabel>
            }
          />
        );
      },
    },
    {
      title: t('Disk configs'),
      field: 'disk',
      canHide: true,
      render: (_, row) => {
        const { custom_data_disk_size = '--', custom_system_disk_size = '--' } =
          row?.replica_specs as Record<string, any>;
        return (
          <>
            <div>
              {t('System disk')}：{custom_system_disk_size}G
            </div>
            <div>
              {t('Data disk')}：{custom_data_disk_size}G
            </div>
          </>
        );
      },
    },
    {
      title: t('Base info'),
      field: 'created_at',
      canHide: true,
      sortable: true,
      render: (v, row) => {
        const specs = row?.replica_specs?.specs;
        return (
          <Field
            label={
              <FieldLabel>
                {t('Creation time')}：{v ? formatTime(v) : '--'}
              </FieldLabel>
            }
            value={
              <FieldLabel black>
                {specs?.startsWith('rgn') ? t('No charge') : t('Pay for used')}
              </FieldLabel>
            }
          />
        );
      },
    },
    {
      title: t('Intranet IP'),
      field: 'pod_ips',
      canHide: true,
      render: (_, { pod_ips }) => (
        <>
          {pod_ips?.length ? pod_ips?.map(({ ip = '' }) => <div key={ip}>{ip || '--'}</div>) : '--'}
        </>
      ),
    },
    // {
    //   title: t('Quick access'),
    //   field: 'pod_ips',
    //   canHide: true,
    //   render: (_, record) => {
    //     const disabled = record.status !== 'Running';
  
    //     return (
    //       <div css={{ display: 'flex', alignItems: 'center',gap: 16, whiteSpace: 'nowrap' }}>
    //         {
    //           record?.servers?.filter((server) => {
    //             return server.server_type !== 'ssh';
    //           })?.map((server) => (
    //             <QuickLink
    //               key={server.server_type}
    //               disabled={disabled}
    //               serverName={server.server_type}
    //               onClick={() => onClickContextMenu('server', record, server.url)}
    //             />
    //           ))
    //         }
    //         <QuickLink
    //           disabled={disabled || !record.ws_url}
    //           serverName={T('Web terminal')}
    //           onClick={() => {
    //             record.ws_url && onClickContextMenu('terminal', record);
    //           }}
    //         />
    //       </div>
    //     );
  
    // },
    {
      title: t('Submitter information'),
      field: 'user_id',
      canHide: true,
      render: v => v || '-',
    },
  ];
};

function ResourceGroup() {
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
        icon={<Icon name="container" size={48} />}
        title={t('Container Instance')}
        description={t('Container Desc')}
      />
      <DataTable
        ref={tableRef}
        tableName="trains"
        rowKey="uuid"
        placeholder={t('Please enter the instance name to search')}
        url="/kapis/aicp.kubesphere.io/v1/resource/namespaces/ALL/resource_group"
        transformRequestParams={handleTransformRequestParams}
        columns={columns}
        serverDataFormat={formatServerData}
        emptyOptions={{
          withoutTable: true,
          image: <Icon name="container" size={48} />,
          title: t('No container instances found'),
        }}
      />
    </div>
  );
}

export default ResourceGroup;
