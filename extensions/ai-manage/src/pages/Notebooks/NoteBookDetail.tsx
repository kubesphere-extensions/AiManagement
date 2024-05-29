import React from 'react';
import { formatTime } from '@ks-console/shared';

function NoteBookDetail({ notebook }: { notebook: any }) {
  return (
    <div
      style={{
        textAlign: 'left',
        whiteSpace: 'nowrap',
        lineHeight: '20px',
      }}
    >
      <div>
        {t('框架 / 镜像')}：{notebook?.image ?? '-'}
      </div>
      <div>
        {t('vCPU | 内存')}：{' '}
        {`${notebook?.replica_specs?.custom_cpu || 0}核 | 
          ${notebook?.replica_specs?.custom_memory || 0}G`}
      </div>
      <div>
        {t('GPU 型号')}：{`${notebook?.replica_specs?.custom_gpu_name || '--'}`}
      </div>
      <div>
        {t('GPU 数量')}：{notebook?.replica_specs?.custom_gpu || 0}
      </div>
      <div>
        {t('系统盘')}：{`${notebook?.replica_specs?.custom_system_disk_size || 0}Gi`}
      </div>
      <div>
        {t('数据盘')}：{`${notebook?.replica_specs?.custom_data_disk_size || 0}Gi`}
      </div>
      <div>
        {t('计费模式')}：
        {t(notebook?.replica_specs?.specs?.startsWith('rgn') ? 'No charge' : 'Pay for used')}
      </div>
      <div>
        {t('创建时间')}： {notebook?.created_at ? formatTime(notebook.created_at) : '--'}
      </div>
    </div>
  );
}

export default NoteBookDetail;
