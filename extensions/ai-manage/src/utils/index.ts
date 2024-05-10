export * from './formatter';

export const formatDuration = (duration: number): string => {
  // 输入验证
  if (typeof duration !== 'number' || isNaN(duration)) {
    throw new Error("Invalid input: duration must be a valid number");
  }

  const SECONDS_PER_MINUTE = 60;
  const MINUTES_PER_HOUR = 60;
  const HOURS_PER_DAY = 24;

  // 计算各个时间单位
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const days = Math.floor(hours / HOURS_PER_DAY);

  // 计算剩余时间
  const remainingSeconds = seconds % SECONDS_PER_MINUTE;
  const remainingMinutes = minutes % MINUTES_PER_HOUR;
  const remainingHours = hours % HOURS_PER_DAY;

  // 构建并返回格式化后的持续时间字符串
  let formattedDuration = '';
  if (days > 0) formattedDuration += `${days}天`;
  if (hours > 0 || days > 0) formattedDuration += `${remainingHours}小时`;
  if (minutes > 0 || hours > 0 || days > 0) formattedDuration += `${remainingMinutes}分`;
  formattedDuration += `${remainingSeconds}秒`;

  return formattedDuration.trim();
};

// 字符串首字母大写
export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getStrategy = (value: string) => {
  if (value === '2') {
    return '禁止调度、排干、标签污点，重启故障节点';
  }
  if (value === '1') {
    return '禁止调度、排干、标签污点';
  }
  return '不做处理';
};
