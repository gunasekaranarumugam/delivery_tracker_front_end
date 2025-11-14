import { Injectable, signal, WritableSignal, Signal, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { of, Observable } from 'rxjs';

import { catchError, tap, finalize } from 'rxjs/operators';



// Assuming these interfaces are correctly defined in './model/...'

import { BU, BusinessUnitCreate, BusinessUnitPatch } from './model/bu';

import { Employee, EmployeeCreate, EmployeePatch } from './model/Employee';

import { Project, ProjectPatch } from './model/Project';

import { Deliverable, DeliverableCreate, DeliverablePatch } from './model/Deliverable';

import { Task, TaskPatch } from './model/Task';

import { Issue, IssueCore, IssueCreate, IssuePatch, IssueUpdate } from './model/Issue';

import { Timesheet, TimesheetCreate, TimesheetPatch } from './model/Timesheet';
import { Time } from '@angular/common';



@Injectable({

  providedIn: 'root'

})

export class DataService {

  private http = inject(HttpClient);

  //private AWSurl = "http://delivery-tracker-developmentalb-762815170.ap-south-1.elb.amazonaws.com/"

  //private apiUrl = 'http://localhost:8000'; // FastAPI base URL

  private apiUrl = "http://delivery-tracker-developmentalb-762815170.ap-south-1.elb.amazonaws.com";

  private timesheetApiUrl = `${this.apiUrl}/api/Task-Status/`; // Endpoint for Timesheets/TaskStatus



  // 💡 CACHE FLAGS: Tracks if data has been fetched during this session

  private buLoaded = false;

  private employeesLoaded = false;

  private projectsLoaded = false;

  private deliverablesLoaded = false;

  private tasksLoaded = false;

  private issuesLoaded = false;

  private timesheetsLoaded = false;



  constructor() {

    // 🛑 ALL FETCH CALLS MUST BE REMOVED FROM THE CONSTRUCTOR (as done here)

 

  }



 // ------------------ BUSINESS UNITS ------------------
private _bu: WritableSignal<BU[]> = signal([]);
readonly bu: Signal<BU[]> = this._bu.asReadonly();

private _buLoading: WritableSignal<boolean> = signal(false);
readonly buLoading: Signal<boolean> = this._buLoading.asReadonly();

private _buError: WritableSignal<any> = signal(null);
readonly buError: Signal<any> = this._buError.asReadonly();



fetchBU(): Observable<BU[]> {
  // Caching check
  if (this.buLoaded && this._bu().length > 0) {
    this._buLoading.set(false);
    return of(this._bu()); // Return data from cache
  }

  this._buLoading.set(true);
  this._buError.set(null);

  return this.http.get<BU[]>(`${this.apiUrl}/api/BusinessUnit`).pipe(
    catchError(err => {
      this._bu.set([]);
      this._buError.set(err);
      return of([]);
    }),
    finalize(() => this._buLoading.set(false)),
    tap(data => {
      this.buLoaded = true;
      this._bu.set(data.filter(bu => bu.entity_status === 'Active'));
    })
  );
}

// CREATE BU
createBU(payload: BusinessUnitCreate): Observable<BU> {
  return this.http.post<BU>(`${this.apiUrl}/api/BusinessUnit/`, payload).pipe(
    tap({
      next: (createdBU) => {
        // Directly update the signal for instant UI update
        this._bu.update(list => [...list, createdBU]);
      },
      error: err => this._buError.set(err)
    })
  );
}


// UPDATE BU
updateBU(id: string, payload: Partial<BU>): Observable<BU> {
  return this.http.put<BU>(`${this.apiUrl}/api/BusinessUnit/${id}`, payload).pipe(
    tap({
      next: (updatedBU) => {
        this._bu.update(list => {
          const index = list.findIndex(b => b.business_unit_id === id);
          if (index > -1) {
            // Merge old BU with updated values to preserve fields not included in payload
            list[index] = { ...list[index], ...updatedBU };
          }
          return [...list]; // create new array reference for reactivity
        });
      },
      error: err => this._buError.set(err)
    })
  );
}


// DELETE / ARCHIVE BU (soft delete)
deleteBU(id: string): Observable<BU> {
  return this.http.patch<BU>(`${this.apiUrl}/api/BusinessUnit/${id}/archive`, {}).pipe(
    tap({
      next: () => {
        this._bu.update(list => list.filter(b => b.business_unit_id !== id));
      },
      error: err => this._buError.set(err)
    })
  );
}



  // ------------------ EMPLOYEES ------------------

  private _employees: WritableSignal<Employee[]> = signal([]);

  readonly employees: Signal<Employee[]> = this._employees.asReadonly();

  private _employeeLoading: WritableSignal<boolean> = signal(false);

  readonly employeeLoading: Signal<boolean> = this._employeeLoading.asReadonly();

  private _employeeError: WritableSignal<any> = signal(null);

  readonly employeeError: Signal<any> = this._employeeError.asReadonly();



  fetchEmployees(): Observable<Employee[]> {

    // 1. CACHING CHECK

    if (this.employeesLoaded && this._employees().length > 0) {

        this._employeeLoading.set(false);

        return of(this._employees());

    }



    this._employeeLoading.set(true);

    this._employeeError.set(null);

    return this.http.get<Employee[]>(`${this.apiUrl}/api/Employees/`).pipe(

      catchError(err => {

            this._employees.set([]);

            this._employeeError.set(err);

            return of([]);

        }),

        finalize(() => {

            this._employeeLoading.set(false);

        }),

      tap(data => {

            this.employeesLoaded = true; // Set cache flag on success

            this._employees.set(data.filter(e => e.entity_status === 'Active'));

      })

    );

  }



    // Employee CRUD methods

  createEmployee(payload: EmployeeCreate): Observable<Employee> {
  return this.http.post<Employee>(`${this.apiUrl}/api/Employees/`, payload).pipe(
    tap({
      next: (newEmployee) => {
        // Add the newly created employee to the reactive list
        this._employees.update(list => [...list, newEmployee]);
      },
      error: err => this._employeeError.set(err)
    })
  );
}


  // UPDATE EMPLOYEE
updateEmployee(id: string, payload: Partial<EmployeeCreate>): Observable<Employee> {
  return this.http.put<Employee>(`${this.apiUrl}/api/Employees/${id}`, payload).pipe(
    tap({
      next: (updatedEmployee) => {
        this._employees.update(list => {
          const index = list.findIndex(e => e.employee_id === id);
          if (index > -1) {
            // Merge old employee with updated fields
            list[index] = { ...list[index], ...updatedEmployee };
          }
          return [...list]; // new array triggers reactivity
        });
      },
      error: err => this._employeeError.set(err)
    })
  );
}


/*deleteBU(id: string): Observable<BU> {
  const payload: BusinessUnitPatch = { entity_status: 'ARCHIVED' };
  return this.http.put<BU>(`${this.apiUrl}/api/BusinessUnit/${id}`, payload).pipe(
    tap({
      next: () => {
        this._bu.update(list => list.filter(b => b.business_unit_id !== id));
      },
      error: err => this._buError.set(err)
    })
  );
}*/


deleteEmployee(id: string): Observable<Employee> {
  const payload: Partial<EmployeePatch> = {}; // Can be empty because backend forces ARCHIVED
  return this.http.patch<Employee>(`${this.apiUrl}/api/Employees/${id}/archive`, payload).pipe(
    tap({
      next: () => {
        this._employees.update(list => list.filter(e => e.employee_id !== id));
      },
      error: err => this._employeeError.set(err)
    })
  );
}









  // ------------------ PROJECTS ------------------

  private _projects: WritableSignal<Project[]> = signal([]);

  readonly projects: Signal<Project[]> = this._projects.asReadonly();

  private _projectLoading: WritableSignal<boolean> = signal(false);

  readonly projectLoading: Signal<boolean> = this._projectLoading.asReadonly();

  private _projectError: WritableSignal<any> = signal(null);

  readonly projectError: Signal<any> = this._projectError.asReadonly();



  fetchProjects(): Observable<Project[]> {

    // 1. CACHING CHECK

    if (this.projectsLoaded && this._projects().length > 0) {

        this._projectLoading.set(false);

        return of(this._projects());

    }

    this._projectLoading.set(true);

    this._projectError.set(null);

    return this.http.get<Project[]>(`${this.apiUrl}/api/Projects/`).pipe(

      catchError(err => { this._projects.set([]); this._projectError.set(err); return of([]); }),

        finalize(() => { this._projectLoading.set(false); }),

      tap(data => {

            this.projectsLoaded = true;

            this._projects.set(data.filter(p => p.entity_status === 'Active'));

      })

    );

  }



    // Project CRUD methods


  createProject(payload: Project): Observable<Project> {
  return this.http.post<Project>(`${this.apiUrl}/api/Projects/`, payload).pipe(
    tap({
      next: (newProject) => {
        // Add the new project directly to the reactive list
        this._projects.update(list => [...list, newProject]);
      },
      error: err => this._projectError.set(err)
    })
  );
}


  // UPDATE PROJECT
updateProject(id: string, payload: Partial<Project>): Observable<Project> {
  return this.http.put<Project>(`${this.apiUrl}/api/Projects/${id}`, payload).pipe(
    tap({
      next: (updatedProject) => {
        this._projects.update(list => {
          const index = list.findIndex(p => p.project_id === id);
          if (index > -1) {
            // Merge old project with updated fields
            list[index] = { ...list[index], ...updatedProject };
          }
          return [...list]; // new array triggers reactivity
        });
      },
      error: err => this._projectError.set(err)
    })
  );
}


 deleteProject(id: string): Observable<Project> {
  const payload: Partial<ProjectPatch> = { entity_status: 'ARCHIVED' };

  return this.http.patch<Project>(`${this.apiUrl}/api/Projects/${id}/archive`, payload).pipe(
    tap({
      next: () => this._projects.update(list => list.filter(p => p.project_id !== id)),
      error: err => this._projectError.set(err)
    })
  );
}

/* 
 next: () => {
        this._employees.update(list => list.filter(e => e.employee_id !== id));
      },
*/







  // ------------------ DELIVERABLES ------------------

  private _deliverables: WritableSignal<Deliverable[]> = signal([]);

  readonly deliverables: Signal<Deliverable[]> = this._deliverables.asReadonly();

  private _deliverableLoading: WritableSignal<boolean> = signal(false);

  readonly deliverableLoading: Signal<boolean> = this._deliverableLoading.asReadonly();

  private _deliverableError: WritableSignal<any> = signal(null);

  readonly deliverableError: Signal<any> = this._deliverableError.asReadonly();



  fetchDeliverables(): Observable<Deliverable[]> {

    // 1. CACHING CHECK

    if (this.deliverablesLoaded && this._deliverables().length > 0) {

        this._deliverableLoading.set(false);

        return of(this._deliverables());

    }

    this._deliverableLoading.set(true);

    this._deliverableError.set(null);

    return this.http.get<Deliverable[]>(`${this.apiUrl}/api/Deliverables/`).pipe(

      catchError(err => { this._deliverables.set([]); this._deliverableError.set(err); return of([]); }),

        finalize(() => { this._deliverableLoading.set(false); }),

      tap(data => {

            this.deliverablesLoaded = true;

            this._deliverables.set(data.filter(d => d.entity_status === 'Active'));

      })

    );

  }



    // Deliverable CRUD methods

 createDeliverable(payload: DeliverableCreate): Observable<Deliverable> {
  return this.http.post<Deliverable>(`${this.apiUrl}/api/Deliverables/`, payload).pipe(
    tap({
      next: (newDeliverable) => {
        // Directly add the new deliverable to the list
        this._deliverables.update(list => [...list, newDeliverable]);
      },
      error: err => this._deliverableError.set(err)
    })
  );
}


  // UPDATE DELIVERABLE
updateDeliverable(id: string, payload: Partial<Deliverable>): Observable<Deliverable> {
  return this.http.put<Deliverable>(`${this.apiUrl}/api/Deliverables/${id}`, payload).pipe(
    tap({
      next: (updatedDeliverable) => {
        this._deliverables.update(list => {
          const index = list.findIndex(d => d.deliverable_id === id);
          if (index > -1) {
            // Merge old deliverable with updated fields
            list[index] = { ...list[index], ...updatedDeliverable };
          }
          return [...list]; // new array triggers Signals reactivity
        });
      },
      error: err => this._deliverableError.set(err)
    })
  );
}


  deleteDeliverable(id: string): Observable<Deliverable> {
  // Payload for archiving
  const payload: Partial<DeliverablePatch> = { entity_status: 'ARCHIVED' };

  return this.http.patch<Deliverable>(`${this.apiUrl}/api/Deliverables/${id}/archive`, payload, {
    headers: { 'Content-Type': 'application/json' }  // ⚠ Make sure this is JSON
  }).pipe(
    tap({
      next: () => this._deliverables.update(list => list.filter(d => d.deliverable_id !== id)),
      error: err => this._deliverableError.set(err)
    })
  );
}








  // ------------------ TASKS ------------------

  private _tasks: WritableSignal<Task[]> = signal([]);

  readonly tasks: Signal<Task[]> = this._tasks.asReadonly();

  private _taskLoading: WritableSignal<boolean> = signal(false);

  readonly taskLoading: Signal<boolean> = this._taskLoading.asReadonly();

  private _taskError: WritableSignal<any> = signal(null);

  readonly taskError: Signal<any> = this._taskError.asReadonly();



  fetchTasks(): Observable<Task[]> {

    // 1. CACHING CHECK

    if (this.tasksLoaded && this._tasks().length > 0) {

        this._taskLoading.set(false);

        return of(this._tasks());

    }

    this._taskLoading.set(true);

    this._taskError.set(null);

    return this.http.get<Task[]>(`${this.apiUrl}/api/Tasks/`).pipe(

      catchError(err => { this._tasks.set([]); this._taskError.set(err); return of([]); }),

        finalize(() => { this._taskLoading.set(false); }),

      tap(data => {

            this.tasksLoaded = true;

            this._tasks.set(data.filter(t => t.entity_status !== 'ARCHIVED'));

      })

    );

  }



    // Task CRUD methods

 // CREATE TASK
createTask(payload: Partial<Task>): Observable<Task> {
  return this.http.post<Task>(`${this.apiUrl}/api/Tasks/`, payload).pipe(
    tap({
      next: (createdTask) => {
        // Directly update the signal for instant UI update
        this._tasks.update(list => [...list, createdTask]);
      },
      error: err => this._taskError.set(err)
    })
  );
}


// UPDATE TASK
updateTask(id: string, payload: Partial<Task>): Observable<Task> {
  return this.http.put<Task>(`${this.apiUrl}/api/Tasks/${id}`, payload).pipe(
    tap({
      next: (updatedTask) => {
        this._tasks.update(list => {
          const index = list.findIndex(t => t.task_id === id);
          if (index > -1) {
            // Merge old task with updated fields
            list[index] = { ...list[index], ...updatedTask };
          }
          return [...list]; // new array triggers Signals reactivity
        });
      },
      error: err => this._taskError.set(err)
    })
  );
}


  deleteTask(id: string): Observable<Task> {

    const payload: Partial<TaskPatch> = { entity_status: 'ARCHIVED' };

    return this.http.patch<Task>(`${this.apiUrl}/api/Tasks/${id}/archive`, payload).pipe(

      tap({ next: () => this._tasks.update(list=>list.filter(t => t.task_id !== id)),
         error: err => this._taskError.set(err) })

    );

  }





  // ------------------ ISSUES ------------------

  private _issues: WritableSignal<Issue[]> = signal([]);

  readonly issues: Signal<Issue[]> = this._issues.asReadonly();

  private _issueLoading: WritableSignal<boolean> = signal(false);

  readonly issueLoading: Signal<boolean> = this._issueLoading.asReadonly();

  private _issueError: WritableSignal<any> = signal(null);

  readonly issueError: Signal<any> = this._issueError.asReadonly();



  fetchIssues(): Observable<Issue[]> {

    // 1. CACHING CHECK

    if (this.issuesLoaded && this._issues().length > 0) {

        this._issueLoading.set(false);

        return of(this._issues());

    }

    this._issueLoading.set(true);

    this._issueError.set(null);

    return this.http.get<Issue[]>(`${this.apiUrl}/api/Issues/`).pipe(

      catchError(err => { this._issues.set([]); this._issueError.set(err); return of([]); }),

        finalize(() => { this._issueLoading.set(false); }),

      tap(data => {

            this.issuesLoaded = true;

            this._issues.set(data);

      })

    );

  }



    // Issue CRUD methods

// CREATE ISSUE
createIssue(payload: IssueCreate): Observable<Issue> {
  return this.http.post<Issue>(`${this.apiUrl}/api/Issues/`, payload).pipe(
    tap({
      next: (createdIssue) => {
        // Directly update the signal for instant UI update
        this._issues.update(list => [...list, createdIssue]);
      },
      error: err => this._issueError.set(err)
    })
  );
}


 // UPDATE ISSUE
updateIssue(id: string, payload: Partial<IssueUpdate>): Observable<Issue> {
  return this.http.put<Issue>(`${this.apiUrl}/api/Issues/${id}`, payload).pipe(
    tap({
      next: (updatedIssue) => {
        this._issues.update(list => {
          const index = list.findIndex(i => i.issue_id === id);
          if (index > -1) {
            // Merge old issue with updated fields
            list[index] = { ...list[index], ...updatedIssue };
          }
          return [...list]; // create new array reference to trigger reactivity
        });
      },
      error: err => this._issueError.set(err)
    })
  );
}


    // src/app/data.service.ts (Corrected deleteIssue method)

// Note: Assuming you import the correct Issue and IssuePatch types
// import { Issue, IssuePatch } from './model/Issue'; 

deleteIssue(id: string): Observable<Issue> {
    
    // ✅ Use IssuePatch as the payload type
    const payload: IssuePatch = { entity_status: 'ARCHIVED' };

    // ✅ The generic type and the return type should be the full Issue object
    return this.http.patch<Issue>(`${this.apiUrl}/api/Issues/${id}/archive`, payload).pipe(
    //                   ^^^^^
        tap({ 
            // Re-fetch issues to update the component's signal
            next: () => this._issues.update(list=>list.filter(i => i.issue_id !== id)), 
            error: err => this._issueError.set(err) 
        })
    );
}





  // ------------------ TIMESHEETS (TASK STATUS) - API IMPLEMENTATION ------------------

 

  private _timesheets: WritableSignal<Timesheet[]> = signal([]);

  readonly timesheets: Signal<Timesheet[]> = this._timesheets.asReadonly();

  private _timesheetLoading: WritableSignal<boolean> = signal(false);

  readonly timesheetLoading: Signal<boolean> = this._timesheetLoading.asReadonly();

  private _timesheetError: WritableSignal<any> = signal(null);

  readonly timesheetError: Signal<any> = this._timesheetError.asReadonly();



  fetchTimesheets(): Observable<Timesheet[]> {

    // 1. CACHING CHECK

    if (this.timesheetsLoaded && this._timesheets().length > 0) {

        this._timesheetLoading.set(false);

        return of(this._timesheets());

    }

    this._timesheetLoading.set(true);

    this._timesheetError.set(null);

    return this.http.get<Timesheet[]>(this.timesheetApiUrl).pipe(

      catchError(err => { this._timesheets.set([]); this._timesheetError.set(err); return of([]); }),

        finalize(() => { this._timesheetLoading.set(false); }),

      tap(data => {

            this.timesheetsLoaded = true;

            this._timesheets.set(data.filter(ts => ts.entity_status === 'Active'));

      })

    );

  }

 

    // Timesheet CRUD methods (now correctly included)
// src/app/data.service.ts (Corrected signature)
// The component must send a complete TimesheetCreate object.
// CREATE TIMESHEET
createTimesheet(payload: TimesheetCreate): Observable<Timesheet> {
  return this.http.post<Timesheet>(this.timesheetApiUrl, payload).pipe(
    tap({
      next: (createdTimesheet) => {
        // Directly update the signal for instant UI update
        this._timesheets.update(list => [...list, createdTimesheet]);
      },
      error: err => this._timesheetError.set(err)
    })
  );
}



  // UPDATE TIMESHEET
updateTimesheet(id: string, payload: Partial<Timesheet>): Observable<Timesheet> {
  return this.http.put<Timesheet>(`${this.apiUrl}/api/Task-Status/${id}`, payload).pipe(
    tap({
      next: (updatedTimesheet) => {
        this._timesheets.update(list => {
          const index = list.findIndex(t => t.task_status_id === id);
          if (index > -1) {
            // Merge old timesheet with updated fields
            list[index] = { ...list[index], ...updatedTimesheet };
          }
          return [...list]; // new array triggers Signals reactivity
        });
      },
      error: err => this._timesheetError.set(err)
    })
  );
}




    deleteTimesheet(id: string): Observable<Timesheet> {

    const payload: Partial<TimesheetPatch> = { entity_status: 'ARCHIVED' };

    return this.http.patch<Timesheet>(`${this.apiUrl}/api/Task-Status/${id}/archive`, payload).pipe(

      tap({ next: () => this._timesheets.update(list=>list.filter(t => t.task_status_id != id)),
         error: err => this._timesheetError.set(err) })

    );

  }

}