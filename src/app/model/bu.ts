export interface BU {
  business_unit_id: string; // The correct ID from FastAPI
  business_unit_name: string;
  business_unit_head_id: string;
  business_unit_head_name: string;
  employee_id: string;
  employee_full_name: string;
  employee_email_address: string;
  business_unit_description: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  created_by_name: string;
  updated_by: string;
  updated_by_name: string
  entity_status: string;
}


export interface BusinessUnitUpdate {
  business_unit_id: string,  
  business_unit_name: string,
  business_unit_head_id: string,
  business_unit_head_name: string,
  business_unit_description: string,
}


export interface BusinessUnitCreate {
  business_unit_id: string;
  business_unit_name: string;
  business_unit_head_id?: string;
  business_unit_description?: string;
}

export interface BusinessUnitPatch {
  entity_status?: string;
}
