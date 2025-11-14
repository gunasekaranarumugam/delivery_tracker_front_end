// Full Task interface (No change needed)
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

// Interface for creating a new Task (Input for POST)
// Correctly omits server-generated fields like task_id, created_at, entity_status.
// TaskCreate.ts (Update this file)

export interface TaskCreate {
  task_id:string;
  deliverable_id: string; // Used to be deliverableId
  task_type_id?: string;  // Used to be taskType
  task_name: string;     // Used to be taskTitle
  task_description?: string; // Used to be taskDescription
  assignee_id?: string;   // Used to be assignee
  reviewer_id?: string;   // Used to be reviewer
  priority?: string;
  task_type_name?:string;
  // REQUIRED FIELDS ADDED/CORRECTED:
  baseline_start_date?: string; // ADDED
  baseline_end_date?: string;   // ADDED
  planned_start_date?: string;  // Used to be planStartDate
  planned_end_date?: string;    // Used to be planEndDate
  effort_estimated_in_hours?:string; // Used to be estimateHours
}

// --- CORRECTED PATCH INTERFACE ---

// Interface for patch/update (partial updates via PATCH verb).
// It makes ALL fields from TaskCreate optional, allowing the client to send
// any combination of fields to update.
// We also explicitly include entity_status as it is a common field to patch.

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
  task_name:string;
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
  // Adding mutable system/status fields explicitly
  entity_status: string;
}

// Alternatively, for maximum flexibility:
// export type TaskPatch = Partial<Task>;