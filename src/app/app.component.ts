import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'bazy-front';
  employees: Employee[];
  editEmployee: Employee;
  deleteEmployee: Employee;
  constructor(private employeeService: EmployeeService) {}
  
  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void{
    this.employeeService.getEmployees().subscribe((response: Employee[]) => {
      this.employees = response;
      console.log(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }  
    );
  }

  public onOpenModal(employee: Employee | null | undefined, mode: String): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add'){
      button.setAttribute('data-target', '#addEmployeeModal');
    }

    if (mode === 'edit'){
      this.editEmployee = employee as Employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }

    if (mode === 'delete'){
      this.deleteEmployee = employee as Employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    
    container?.appendChild(button);
    button.click();

  }

  public onAddEmployee(addForm: NgForm): void{
    document.getElementById('add-employee-form')?.click();
    this.employeeService.addEmployees(addForm.value).subscribe(
      (response: Employee | null | undefined) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onUpdateEmployee(employee: Employee): void{
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employee_id: number | undefined ): void{
    this.employeeService.deleteEmployee(employee_id).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: String): void{
    const results: Employee[]=[];
    for (const employee of this.employees){
      if(employee.first_name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      employee.last_name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      employee.phone_number.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      employee.job_id.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      employee.salary.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(employee);
      }

    }
    this.employees = results;
    if(results.length===0 || !key){
    this.getEmployees();
    }
}


}
