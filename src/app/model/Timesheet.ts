export interface TimesheetCore {
    task_status_id: string
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
    updated_at:string;
    updated_by_name:string;
    updated_by:string
    action_date: string
    progress: string
    hours_spent: string
    remarks?: string
    created_at: string
    created_by: string
    created_by_name: string
    entity_status: string
}

export interface TimesheetCreate{
    business_unit_id?:string;
    task_status_id:string,
    deliverable_id: string,
    project_id:string,
    task_id: string,
    action_date: string,
    progress: string,
    hours_spent: string,
    remarks:string
}

export interface TimesheetUpdate{
    business_unit_id:string;
    business_unit_name:string;
    business_unit_head_id:string;
    business_unit_head_name:string;
    project_id:string;
    project_name:string;
    delivery_manager_id:string;
    delivery_manager_name:string;
    deliverable_name:string;
    deliverable_id:string;
    task_name:string;
    task_id:string;
    action_date:string;
    progress:string;
    remarks:string;
    hours_spent:string;
    task_status_id:string;
}

export interface TimesheetPatch {
    entity_status: string;
};

export interface Timesheet extends TimesheetCore {
    task_status_id: string; 
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
}