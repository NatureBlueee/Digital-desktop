import { supabase } from './client';
import { AppData, AppType } from '@/types';

/**
 * 数据库操作工具
 */

/**
 * 保存或更新应用数据
 */
export async function saveAppData(appData: AppData) {
  const { data, error } = await supabase
    .from('apps')
    .upsert({
      id: appData.id,
      type: appData.type,
      name: appData.name,
      icon: appData.icon,
      content: appData.content,
      metadata: appData.metadata,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 获取所有应用数据
 */
export async function getAllApps(): Promise<AppData[]> {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * 获取指定类型的应用数据
 */
export async function getAppByType(type: AppType): Promise<AppData | null> {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .eq('type', type)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // 没有找到
    throw error;
  }
  return data;
}

/**
 * 删除应用数据
 */
export async function deleteApp(id: string) {
  const { error } = await supabase.from('apps').delete().eq('id', id);

  if (error) throw error;
}
