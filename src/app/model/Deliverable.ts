// Full Deliverable interface
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

// Interface for creating a new deliverable
export interface DeliverableCreate {
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

// Interface for patch/update (partial updates)
/**
 * Defines the structure for a Deliverable PATCH request body.
 * All fields are optional because PATCH is used for partial updates.
 * Server-managed metadata (e.g., created_at, created_by) is excluded.
 */
export interface DeliverablePatch {
    

    // Status (Used for soft-delete/archive operations)
    entity_status?: string;
    
    // Note: deliverable_id and project_id are typically not changed via PATCH.
    // deliverable_id is often passed in the URL (e.g., /api/Deliverables/{id}).
}

