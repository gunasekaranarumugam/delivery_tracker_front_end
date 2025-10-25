export interface Task{
  id?: string ;
  deliverableId?:string;
  taskType?:string;
  taskTitle?:string;
  taskDescription?:string;
  assignee?:string;
  reviewer?:string;
  priority?:string;
  planStartDate?:string;
  planEndDate?:string;
  estimateHours?:string;
}
