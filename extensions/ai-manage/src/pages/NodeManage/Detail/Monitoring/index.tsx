import React, { useState } from 'react';
import { get, isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';
import { useStore } from '@kubed/stook';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import {
  MonitorController,
  SimpleArea,
  hideGPUByLicense,
  monitorStore,
  nodeMonitiorStore,
  getAreaChartOps,
  getZeroValues,
} from '@ks-console/shared';
const MetricTypes = {
  cpu_utilisation: 'node_cpu_utilisation',
  cpu_load1: 'node_load1',
  cpu_load5: 'node_load5',
  cpu_load15: 'node_load15',
  gpu_utilization: 'node_per_gpu_utilization',
  gpu_memory_utilization: 'node_per_gpu_memory_utilization',
  gpu_memory_available: 'node_per_gpu_memory_available',
  gpu_memory_usage: 'node_per_gpu_memory_usage',
  gpu_temp: 'node_per_gpu_temp',
  gpu_power_usage: 'node_per_gpu_power_usage',
  memory_utilisation: 'node_memory_utilisation',
  memory_usage: 'node_memory_usage_wo_cache',
  disk_utilisation: 'node_disk_size_utilisation',
  disk_inode_utilisation: 'node_disk_inode_utilisation',
  device_size_utilisation: 'node_device_size_utilisation',
  disk_inode_usage: 'node_disk_inode_usage',
  disk_inode_total: 'node_disk_inode_total',
  disk_read_iops: 'node_disk_read_iops',
  disk_write_iops: 'node_disk_write_iops',
  disk_read_throughput: 'node_disk_read_throughput',
  disk_write_throughput: 'node_disk_write_throughput',
  net_transmitted: 'node_net_bytes_transmitted',
  net_received: 'node_net_bytes_received',
};
const { getApi } = nodeMonitiorStore;
const { useMonitorStore } = monitorStore;
const { fetchMetrics } = useMonitorStore({ getApiFn: getApi });
const Chart = styled(SimpleArea).attrs({
  theme: 'light',
})`
  &:not(first-child) {
    margin-top: 8px;
  }
`;

function Monitorings() {
  const params: Record<string, any> = useParams();
  const { cluster } = params;
  const [detail] = useStore('detailProps');
  const { name, role = [], createTime } = detail;
  const [metrics, setMetrics] = useState<Record<string, any>>({});
  const { mutate, isLoading } = useMutation(
    (fecthParams: any) => {
      return fetchMetrics({
        cluster,
        resources: [name],
        metrics: Object.values(hideGPUByLicense(MetricTypes, cluster)),
        fillZero: !role.includes('edge'),
        ...fecthParams,
      });
    },
    {
      onSuccess: data => {
        setMetrics(data);
      },
    },
  );

  const deviceUsage = get(metrics, `${MetricTypes.device_size_utilisation}.data.result`, []);
  const legend = deviceUsage && deviceUsage.map((item: any) => item?.metric?.device);
  {
    /* TODO: missing INODE_USAGE */
  }
  const monitoringCfgs = [
    {
      type: 'utilisation',
      title: 'GPU_USAGE',
      unit: '%',
      legend: ['GPU_USAGE'],
      range: [0, 100],
      data: get(metrics, `${MetricTypes.gpu_utilization}.data.result`, []),
    },
    {
      type: 'utilisation',
      title: 'GPU_MEMORY_USAGE',
      unit: '%',
      legend: ['GPU_MEMORY_USAGE'],
      range: [0, 100],
      data: get(metrics, `${MetricTypes.gpu_memory_utilization}.data.result`, []),
    },
    {
      type: 'usage',
      title: 'GPU_TEMP',
      unit: '℃',
      legend: ['GPU_TEMP'],
      data: get(metrics, `${MetricTypes.gpu_temp}.data.result`, []),
    },
    {
      type: 'usage',
      title: 'GPU_ENERGY_NO_PERCENT_TCAP',
      unit: 'W',
      legend: ['GPU_ENERGY_NO_PERCENT_TCAP'],
      data: get(metrics, `${MetricTypes.gpu_power_usage}.data.result`, []),
    },
    {
      type: 'usage',
      title: 'GPU_MEMORY_USAGE',
      unitType: 'memory',
      legend: ['NODE_GPU_MEMORY_USAGED', 'NODE_GPU_MEMORY_UNUSAGED'],
      data: [
        ...get(metrics, `${MetricTypes.gpu_memory_usage}.data.result`, []),
        ...get(metrics, `${MetricTypes.gpu_memory_available}.data.result`, []),
      ],
    },
    {
      type: 'utilisation',
      title: 'CPU_USAGE',
      unit: '%',
      legend: ['CPU_USAGE'],
      data: get(metrics, `${MetricTypes.cpu_utilisation}.data.result`, []),
    },
    {
      type: 'load',
      title: 'AVERAGE_CPU_LOAD',
      legend: [t('TIME_M', { count: 1 }), t('TIME_M', { count: 5 }), t('TIME_M', { count: 15 })],
      data: [
        get(metrics, `${MetricTypes.cpu_load1}.data.result[0]`, {}),
        get(metrics, `${MetricTypes.cpu_load5}.data.result[0]`, {}),
        get(metrics, `${MetricTypes.cpu_load15}.data.result[0]`, {}),
      ],
    },
    {
      type: 'usage',
      title: 'MEMORY_USAGE',
      unitType: 'memory',
      legend: ['MEMORY_USAGE'],
      data: get(metrics, `${MetricTypes.memory_usage}.data.result`, []),
    },
    {
      type: 'utilisation',
      title: 'MEMORY_USAGE',
      unit: '%',
      legend: ['MEMORY_USAGE'],
      range: [0, 100],
      data: get(metrics, `${MetricTypes.memory_utilisation}.data.result`, []),
    },
    {
      type: 'utilisation',
      title: 'DISK_USAGE',
      unit: '%',
      legend: ['DISK_USAGE'],
      range: [0, 100],
      data: get(metrics, `${MetricTypes.disk_utilisation}.data.result`, []),
    },
    {
      type: 'utilisation',
      title: 'DISK_USAGE_DETAILS',
      unit: '%',
      legend: ['AVERAGE_USAGE', ...legend],
      range: [0, 100],
      data: [get(metrics, `${MetricTypes.disk_utilisation}.data.result[0]`), ...deviceUsage],
    },
    {
      type: 'iops',
      title: 'IOPS',
      legend: ['READ', 'WRITE'],
      data: [
        get(metrics, `${MetricTypes.disk_read_iops}.data.result[0]`, {}),
        get(metrics, `${MetricTypes.disk_write_iops}.data.result[0]`, {}),
      ],
    },
    {
      type: 'throughput',
      title: 'DISK_THROUGHPUT',
      unitType: 'throughput',
      legend: ['READ', 'WRITE'],
      data: [
        get(metrics, `${MetricTypes.disk_read_throughput}.data.result[0]`, {}),
        get(metrics, `${MetricTypes.disk_write_throughput}.data.result[0]`, {}),
      ],
    },
    {
      type: 'bandwidth',
      title: 'NETWORK_TRAFFIC',
      unitType: 'bandwidth',
      legend: ['OUT', 'IN'],
      data: [
        get(metrics, `${MetricTypes.net_transmitted}.data.result[0]`, {}),
        get(metrics, `${MetricTypes.net_received}.data.result[0]`, {}),
      ],
    },
  ];
  const configs = hideGPUByLicense(monitoringCfgs, cluster);

  return (
    <MonitorController
      createTime={createTime}
      onFetch={mutate}
      loading={isLoading}
      isEmpty={isEmpty(metrics)}
    >
      {configs.map((item: any) => {
        item.data = isEmpty(item.data) ? [{ values: getZeroValues() }] : item.data;
        if (item.title === 'GPU_MEMORY_USAGE' && item.unitType === 'memory') {
          const dataLength = item.data?.length;
          item.legend = item.data.map(
            (data: any, index: number) =>
              `GPU${data?.metric?.gpu ?? ''}(${t(
                index > dataLength / 2 - 1 ? item.legend[1] : item.legend[0],
              )})`,
          );
        } else if (item.title.includes('GPU')) {
          item.legend = item.data.map((data: any) => `GPU${data?.metric?.gpu ?? ''}`);
        }
        const config = getAreaChartOps(item);
        return <Chart {...config} key={`${item.title}_${item.type}`} categories={item.legend} />;
      })}
    </MonitorController>
  );
}
export default Monitorings;
