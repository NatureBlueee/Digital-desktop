import { AppData, AppType } from '@/types';

/**
 * 数据适配器基类
 * 所有应用的数据适配器都应该继承这个类
 */
export abstract class BaseAdapter<T extends AppData = AppData> {
  protected appType: AppType;

  constructor(appType: AppType) {
    this.appType = appType;
  }

  /**
   * 从上传的文件中解析数据
   * @param file 上传的文件
   * @returns 解析后的应用数据
   */
  abstract parseFromFile(file: File): Promise<T>;

  /**
   * 从JSON对象中解析数据
   * @param json JSON对象
   * @returns 解析后的应用数据
   */
  abstract parseFromJSON(json: any): T;

  /**
   * 验证数据格式是否正确
   * @param data 要验证的数据
   * @returns 是否有效
   */
  abstract validate(data: any): boolean;

  /**
   * 生成应用ID
   */
  protected generateId(): string {
    return `${this.appType}-${Date.now()}`;
  }

  /**
   * 创建基础的元数据
   */
  protected createMetadata() {
    return {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0',
    };
  }
}
