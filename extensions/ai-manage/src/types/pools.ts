/**
 * 计算池属性
 */
interface Pool {
  /**
   * ID
   */
  pool_id: string;
  /**
   * 算力池名称
   */
  pool_name: string;
  /**
   * 状态
   */
  status: string;
  /**
   * 状态原因
   */
  reason: string;
  /**
   * 规格类型
   */
  aipods_type: string;
  /**
   * 节点数量
   */
  node_count: number;
  /**
   * GPU 数量
   */
  gpu_count: number;
  /**
   * 其他信息
   */
  extra_info: string;
  /**
   * 描述
   */
  description: string;
  /**
   * 创建时间
   */
  created_at: string;
  /**
   * 更新时间
   */
  updated_at: string;
};

interface AiPodFilter {
  /**
   * 属性 ID
   */
  attr_id: string;
  /**
   * 属性值
   */
  attr_value: string;
  /**
   * 属性名称
   */
  name: string;
  /**
   * 排序
   */
  display_order: number;
  /**
   * 描述
   */
  description: string;
  /**
   * 创建时间
   */
  create_time: string;
};

/**
 * 产品规格 - from 产品中心
 */
interface AiPod {
  /**
   * 产品 ID
   */
  prod_id: string;
  /**
   * 产品名称
   */
  name: string;
  /**
   * 属性 ID
   */
  attr_id: string;
  /**
   * 属性编码
   */
  attr_code: 'aipods_type';
  /**
   * 创建时间
   */
  create_time: string;
  /**
   * 描述
   */
  description: string;
  /**
   * 属性列表
   */
  filters: AiPodFilter[];
}
