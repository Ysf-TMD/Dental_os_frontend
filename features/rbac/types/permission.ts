export interface Permission {
  id: number;
  name: string;
  display_name: string;
  action: string;
  page_id: number;
  group_name?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PermissionCreate {
  name: string;
  display_name: string;
  action: string;
  page_id: number;
  group_name?: string;
  description?: string;
}

export interface PermissionUpdate {
  name?: string;
  display_name?: string;
  action?: string;
  page_id?: number;
  group_name?: string;
  description?: string;
}
