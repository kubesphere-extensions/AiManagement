/* eslint-disable @typescript-eslint/naming-convention */
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Field,
  Banner,
  notify,
  Tooltip,
  Button,
  Dropdown,
  Menu,
  MenuItem,
} from '@kubed/components';
import { get } from 'lodash';
import {
  // DataTable,
  TableRef,
  // Column,
  formatTime,
  StatusIndicator,
  transformRequestParams,
  Icon,
  DeleteConfirmModal,
} from '@ks-console/shared';
import { DataTable, Column } from '../../components/DataTable';
import { useMutation } from 'react-query';
import { request } from '@ks-console/shared';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy, More, Trash } from '@kubed/icons';
import { useDisclosure } from '@kubed/hooks';

import { capitalizeFirstLetter } from '../../utils';
import { FieldLabel, ResourceId } from './styles';
import NoteBookDetail from './NoteBookDetail';

const STATUS_MAP = ['ALL', 'PENDING', 'CREATING', 'RUNNING'];

const getColumns = ({ MoreActions }: any): Column[] => {
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
              ${custom_gpu_type} ${custom_gpu_memory || '--'}${custom_gpu_memory ? 'G *' : ''} ${
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
    {
      title: t('操作'),
      field: 'detail',
      canHide: true,
      render: (v, row) => {
        const content = NoteBookDetail({ notebook: row });
        return (
          <Tooltip content={content} maxWidth={1000}>
            <a style={{ color: '#55bc8a' }}>实例详情</a>
          </Tooltip>
        );
      },
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
};

function Container() {
  const tableRef = useRef<TableRef>();
  const createModal = useDisclosure();
  const [current, setCurrent] = useState<any>({});

  const MoreActions = ({ row }: { row: any }) => {
    const handle = () => {
      if (row.fault_status === '1') return;
      createModal.open();
      setCurrent(row);
    };

    return (
      <Menu>
        <MenuItem icon={<Trash />} onClick={handle} disabled={row.fault_status === '1'}>
          {t('释放实例')}
        </MenuItem>
      </Menu>
    );
  };
  const columns = getColumns({ MoreActions });
  const formatServerData = (serverData: Record<string, any>) => {
    return {
      items: get(serverData, 'data', []),
      totalItems: get(serverData, 'counts', 0),
    };
  };

  const { mutate, isLoading: isDeleting } = useMutation(
    () => {
      const url = '/kapis/aicp.kubesphere.io/v1/notebooks/namespaces/';
      const paramUrl = `${url}${current.namespace}/notebooks?uuid=${current.uuid}`;
      return request.delete(paramUrl);
    },
    {
      onSuccess: () => {
        createModal.close();
        tableRef.current?.refetch();
      },
    },
  );

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
        url="/kapis/aicp.kubesphere.io/v1/notebooks/namespaces/ALL/notebooks"
        transformRequestParams={handleTransformRequestParams}
        columns={columns}
        serverDataFormat={formatServerData}
        emptyOptions={{
          withoutTable: true,
          image: <Icon name="container" size={48} />,
          title: t('No container instances found'),
        }}
      />
      <DeleteConfirmModal
        visible={Boolean(createModal.isOpen)}
        tip="释放容器实例，将会回收 GPU 卡、系统盘和数据盘，数据将被删除。如需保留数据，请将数据转移到共享文件存储中，不支持恢复等操作，请谨慎操作。"
        // resource={selectedExtensionName}
        title={`确定要释放容器实例 "${current?.name} ${current?.uuid}" 吗?`}
        confirmLoading={isDeleting}
        onOk={() => mutate()}
        onCancel={createModal.close}
      />
    </div>
  );
}

export default Container;
