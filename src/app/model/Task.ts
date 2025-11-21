export interface Task {
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
    task_id:string
    task_name: string
    task_description: string
    task_type_id: string
    task_type_name: string
    priority: string
    baseline_start_date: string
    baseline_end_date: string
    planned_start_date: string
    planned_end_date: string
    effort_estimated_in_hours: string
    assignee_id: string
    assignee_name: string
    reviewer_id: string
    reviewer_name: string
    created_at: string
    created_by: string
    created_by_name: string
    updated_at: string
    updated_by: string
    updated_by_name: string
    entity_status: string
}

export interface TaskCreate {
  task_id:string;
  deliverable_id?: string;
  task_type_id: string;  
  task_name: string;    
  task_description?: string;
  assignee_id?: string;   
  reviewer_id?: string;   
  priority?: string;
  task_type_name:string;
  project_id?:string;
  business_unit_id?:string;
  baseline_start_date?: string;
  baseline_end_date?: string;   
  planned_start_date?: string; 
  planned_end_date?: string;    
  effort_estimated_in_hours?:string; 
}

export interface TaskUpdate {
  assignee_id?:string;
  reviewer_id?:string;
  business_unit_id:string;
  business_unit_name: string;
  business_unit_head_id: string;
  business_unit_head_name: string;
  project_id: string;
  project_name: string;
  delivery_manager_id:string;
  dleivery_manager_name:string;
  deliverable_id:string;
  deliverable_name:string;
  task_type_id:string;
  task_type_name:string;
  task_id:string;
  task_name?:string;
  task_description:string;
  assignee_name?:string;
  reviewer_name?:string;
  priority:string;
  planned_start_date:string;
  planned_end_date:string;
  baseline_start_date:string;
  baseline_end_date:string;
  effort_estimated_in_hours:string;
}

export interface TaskPatch  {
  entity_status: string;
}
