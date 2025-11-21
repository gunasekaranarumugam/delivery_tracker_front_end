export interface EmployeeCreate {
  employee_id?:string;
  employee_full_name?: string;
  employee_email_address?: string;
  password: string; 
}

export interface EmployeeUpdate {
  employee_id: string;
  business_unit_id: string;
  business_unit_head_id: string;
  business_unit_name: string;
  business_unit_head_name: string;
  employee_full_name: string;
  employee_email_address: string;
  
}

export interface Employee {
    business_unit_id: string;
    business_unit_name: string;
    business_unit_head_id: string;
    business_unit_head_name: string;
    employee_id: string;
    employee_full_name: string;
    employee_email_address: string;
    created_at: string;
    created_by: string;
    created_by_name: string;
    updated_at: string;
    updated_by: string;
    updated_by_name: string;
    password:string;
    entity_status: string;
}

export interface EmployeeLogin {
  employee_email_address: string;
  password: string;
}

export interface EmployeeLoginResponse {
  employee_id: string;
  password: string;
  employee_full_name: string;
  employee_email_address: string;
  auth_token: string;
}

export interface EmployeePatchGeneral {
  employee_id:string;
  employee_full_name?: string;
  employee_email_address?: string;
  password?: string;
  business_unit_id?: string;
  entity_status?: string;
  updated_by: string; 
}

export interface EmployeePatch {
  employee_id?:string;
  employee_full_name?: string;
  business_unit_id?: string;
  entity_status: string; 
}