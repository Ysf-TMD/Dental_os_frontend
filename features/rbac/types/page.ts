import { Permission } from './permission';

export interface Page {
  id: number;
  name: string;
  display_name: string;
  path: string;
  component?: string;
  icon?: string;
  group_name?: string;
  is_active: boolean;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface PageCreate {
  name: string;
  display_name: string;
  path: string;
  component?: string;
  icon?: string;
  group_name?: string;
  is_active?: boolean;
}

export interface PageUpdate {
  name?: string;
  display_name?: string;
  path?: string;
  component?: string;
  icon?: string;
  group_name?: string;
  is_active?: boolean;
}
