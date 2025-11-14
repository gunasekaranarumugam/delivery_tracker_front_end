// src/app/model/employee.ts

import { Project } from "./Project"; // Assuming Project is imported for related entities if needed

// 1. EmployeeCreate: Used for POST /employee/ (Initial creation/Registration)
// Contains the required fields the client provides.
export interface EmployeeCreate {
  employee_id:string;
  employee_full_name: string;
  employee_email_address: string;
  password: string; // Required for creation
  business_unit_id: string;

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

// 2. EmployeeRead: Used for GET/Response body (The full entity from the DB, excluding password)
// This is your main model interface.
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

// EmployeeLogin: Request body for login
export interface EmployeeLogin {
  employee_email_address: string;
  password: string;
}

// EmployeeLoginResponse: Response body from login
export interface EmployeeLoginResponse {
  employee_id: string;
  password: string;
  employee_full_name: string;
  employee_email_address: string;
  auth_token: string;
}


// 5. EmployeePatchGeneral: Used for PATCH /employee/{id} (General Updates)
// Allows partial updates for any field except the ID.
export interface EmployeePatchGeneral {
  employee_id:string;
  employee_full_name?: string;
  employee_email_address?: string;
  password?: string;
  business_unit_id?: string;
  entity_status?: string;
  updated_by: string; // Required by your Pydantic schema
}

// 6. EmployeePatchArchive: Used specifically for PATCH /employee/{id}/archive (Soft Delete)
export interface EmployeePatch {
  employee_id?:string;
  employee_full_name?: string;
  business_unit_id?: string;
  entity_status: string; // Expected to be "ARCHIVED"
}