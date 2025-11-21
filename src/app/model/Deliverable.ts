export interface Deliverable {
    business_unit_id: string
    business_unit_name: string
    business_unit_head_id: string
    business_unit_head_name: string
    project_id: string
    project_name: string
    delivery_manager_id: string
    delivery_manager_name: string
    deliverable_id: string
    deliverable_name: string
    deliverable_description: string
    priority: string
    baseline_start_date: string
    baseline_end_date: string
    planned_start_date: string
    planned_end_date: string
    created_at: string
    created_by: string
    created_by_name: string
    updated_at: string
    updated_by: string
    updated_by_name: string
    entity_status: string
}

export interface DeliverableCreate {
  business_unit_id?:string;
  deliverable_id?: string;
  project_id?: string;
  deliverable_name?: string;
  deliverable_description?: string;
  priority?: string;
  planned_start_date?:string;
  planned_end_date?:string;
  baseline_start_date?: string;
  baseline_end_date?:string;
}

export interface DeliverableUpdate {
  business_unit_name: string;
  business_unit_id:string;
  business_unit_head_id:string;
  business_unit_head_name: string;
  project_id:string;
  project_name: string;
  delivery_manager_id:string;
  delivery_manager_name: string;
  deliverable_id:string;
  deliverable_name:string;
  priority:string;
  planned_start_date?:string;
  planned_end_date?:string;
  baseline_start_date?:string;
  baseline_end_date?:string;

}

export interface DeliverablePatch {
   entity_status?: string;
}

