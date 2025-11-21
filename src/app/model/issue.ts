export interface IssueUpdate {
  business_unit_id?: string;
  business_unit_name?: string;
  project_id?: string;
  project_name?: string;
  deliverable_id?: string;
  deliverable_name?: string;
  task_id: string;
  task_name: string;
  issue_id: string;
  issue_title: string;
  issue_description: string;
  action_owner_name: string;
  action_owner_id: string;
  issue_priority: string;
  issue_status: string;
}

export interface IssueCreate {
  issue_id: string;
  task_id: string;
  issue_title: string;
  issue_description: string;
  action_owner_id: string;
  issue_priority: string;
  issue_status: string;
  entity_status: string; 
}

export interface Issue {
  business_unit_id: string;
  business_unit_name: string;
  project_id: string;
  project_name: string;
  deliverable_id: string;
  deliverable_name: string;
  task_id: string;
  task_name: string;
  issue_id: string;
  issue_title: string;
  issue_description: string;
  action_owner_id: string;
  action_owner_name: string;
  issue_priority: string;
  issue_status: string;
  entity_status: string;
  created_at: string;
  created_by_name: string;
  updated_at: string;
  updated_by_name: string;
}

export interface IssueCore {
  business_unit_id: string;
  business_unit_name: string;
  project_id: string;
  project_name: string;
  deliverable_id: string;
  deliverable_name: string;
  task_id: string;
  task_name: string;
  issue_id: string;
  issue_title: string;
  issue_description: string;
  action_owner_id: string;
  action_owner_name: string;
  issue_priority: string;
  issue_status: string;
  entity_status: string;
  created_at: string;
  created_by_name: string;
  updated_at: string;
  updated_by_name: string;
}

export interface IssuePatch {
    entity_status?:string;
}
