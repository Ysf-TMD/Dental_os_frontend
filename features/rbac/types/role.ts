export interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  is_active: boolean;
  users_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface RoleCreate {
  name: string;
  display_name: string;
  description?: string;
  is_active?: boolean;
}

export interface RoleUpdate {
  name?: string;
  display_name?: string;
  description?: string;
  is_active?: boolean;
}
