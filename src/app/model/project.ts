export interface Project {
  business_unit_id: string;
    business_unit_name: string;
    business_unit_head_id: string;
    business_unit_head_name: string;
    project_id: string;
    project_name: string;
    project_description: string;
    delivery_manager_id: string;
    delivery_manager_name: string;
    baseline_start_date: string;
    baseline_end_date: string;
    planned_start_date: string;
    planned_end_date:  string;
    created_at: string;
    created_by: string;
    created_by_name: string;
    updated_at: string;
    updated_by: string;
    updated_by_name: string;
    entity_status:string;
}

export interface ProjectCreate {
  project_id: string;
  business_unit_id: string;
  project_name: string;
  project_description?: string;
  delivery_manager_id?: string;
  delivery_manager_name?: string;
  baseline_start_date?:string;
  baseline_end_date?:string;
  planned_start_date?:string;
  planned_end_date?:string;
}

export interface ProjectUpdate {
   project_id: string;
   project_name: string;
   business_unit_id: string;
   business_unit_name: string;
   project_description: string;
   delivery_manager_id: string;
   delivery_manager_name: string;
   baseline_start_date?:string;
   baseline_end_date?:string;
   planned_start_date?:string;
   planned_end_date?:string;
}

export interface ProjectPatch {
   entity_status?: string;
}
