/* eslint-disable @typescript-eslint/indent */
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Pen, Trash, Topology } from '@kubed/icons';
import { request, DetailPagee, formatTime, StatusIndicator } from '@ks-console/shared';
import { Loading } from '@kubed/components';
import { useStore } from '@kubed/stook';

import { formatDuration } from '../../../utils';

export default function TraingDetail() {
  const { id, endpoint, cluster } = useParams();

  const { data, isLoading } = useQuery(
    ['fetchTraingDetail'],
    async () => {
      return request
        .get(
          // eslint-disable-next-line max-len
          `/kapis/aicp.kubesphere.io/v1/trains/namespaces/ALL/endpoints/${endpoint}/train?uuid=${id}&endpoint=${endpoint}&service=qai`,
        )
        .then(res => {
          if ((res as any)?.ret_code === 0) {
            return res?.data ?? {};
          }
        });
    },
    { enabled: !!id && !!endpoint },
  );

  const [, setDetailProps] = useStore('trainingDetail', data);

  const attrs = () => {
    const detail = data || {};
    return [
      {
        label: t('NAME'),
        value: detail?.name ?? '-',
      },
      {
        label: 'ID',
        value: detail?.uuid ?? '-',
      },
      {
        label: t('STATUS'),
        value: (
          <StatusIndicator type={detail?.status}>
            {t(`${detail?.status?.toUpperCase()}`)}
          </StatusIndicator>
        ),
      },
      {
        label: t('Image'),
        value: <div style={{ width: 200 }}>{detail?.image ?? '-'}</div>,
      },
      {
        label: t('存储与数据'),
        value: (
          <div>
            {detail?.volume_specs?.length
              ? detail.volume_specs.map((volume: any, index: number) => (
                  <div key={index} style={{ marginTop: index == 0 ? 0 : 8 }}>
                    <div>{`${t('Data collection')}: ${volume.file_set}`}</div>
                    <div>{`${t('Mount point')}: ${volume.mount_path}`}</div>
                  </div>
                ))
              : '--'}
          </div>
        ),
      },
      {
        label: t('启动命令'),
        value: <div style={{ width: 200 }}>{detail?.command ?? '-'}</div>,
      },
      {
        label: t('环境变量'),
        value: (
          <div>
            {detail?.envs?.length
              ? detail.envs.map((env: any, index: number) => (
                  <div key={index}>{`${env.name}: ${env.value}`}</div>
                ))
              : '--'}
          </div>
        ),
      },
      {
        label: t('自动重试'),
        value:
          detail?.restart_policy === 'Never'
            ? t('Closed')
            : detail?.backoff_limit
            ? `${detail?.backoff_limit} ${t('Times')}`
            : '--',
      },
      {
        label: t('超时配置'),
        value: detail?.active_deadline_seconds
          ? formatDuration(detail.active_deadline_seconds * 1000)
          : '--',
      },
      {
        label: t('提交者'),
        value: detail?.user_id || '--',
      },
      {
        label: t('创建时间'),
        value: detail?.created_at ? formatTime(detail.created_at) : '--',
      },
      {
        label: t('开始运行时间'),
        value: detail?.running_at ? formatTime(detail.running_at) : '--',
      },
      {
        label: t('更新时间'),
        value: detail?.updated_at ? formatTime(detail.updated_at) : '--',
      },
    ];
  };

  useEffect(() => {
    if (data?.uuid) {
      setDetailProps(data);
    }
  }, [data]);

  if (isLoading) {
    return <Loading className="page-loading" />;
  }

  return (
    <DetailPagee
      tabs={[
        { title: t('基本信息'), path: 'base_info' },
        { title: t('容器组'), path: 'pods' },
        // { title: t('日志'), path: 'log' },
      ]}
      cardProps={{
        name: (data?.name || id) ?? '-',
        attrs: attrs(),
        icon: <Topology size={28} />,
        breadcrumbs: {
          label: t('Distributed training'),
          url: `/ai-manage/${cluster}/training`,
        },
        // actions: [
        //   {
        //     key: 'edit',
        //     icon: <Pen />,
        //     text: t('Edit pool'),
        //     // onClick: () => setVisible('edit'),
        //   },
        //   {
        //     key: 'delete',
        //     icon: <Trash />,
        //     text: t('Delete pool'),
        //     // onClick: () => setVisible('delete'),
        //     props: {
        //       color: 'error',
        //     },
        //   },
        // ],
      }}
    />
  );
}
