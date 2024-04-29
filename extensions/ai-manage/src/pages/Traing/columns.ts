import React from 'react';
import { DataTable, formatTime, StatusIndicator, Column, TableRef } from '@ks-console/shared';

export default function getColumns(): Column[] {
  return [
    {
      title: t('Task Name / ID'),
      field: 'name',
      canHide: true,
      render: v => v || '-',
    },
    {
      title: t('Task Status'),
      field: 'status',
      canHide: true,
      render: v => v || '-',
    },
    {
      title: '镜像',
      field: "image",
      canHide: true,
      render: v => v || '-',
    },
    {
      title: t('创建时间'),
      field: 'created_at',
      canHide: true,
      render: v => (v ? formatTime(v) : '-'),
    },
    {
      title: t('开始运行时间'),
      field: 'running_at',
      canHide: true,
      render: v => (v ? formatTime(v) : '-'),
    },
    {
      title: t('完成时间'),
      field: 'ended_at',
      canHide: true,
      render: v => (v ? formatTime(v) : '-'),
    },
    {
      title: t('运行时长'),
      field: 'running_time',
      canHide: true,
      render: v => v || '-',
    },
    {
      title: t('提交者信息'),
      field: 'user_id',
      canHide: true,
      render: (v, row) => row?.user_name || '-',
    },
  ];
}
