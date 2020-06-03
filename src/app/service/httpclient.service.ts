import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest, HttpResponse } from "@angular/common/http";
import{EmployeeInfo} from "../model/employee-info"
import { EmployeeLeaveInfo } from '../model/employee-leave-info';
import { Observable } from 'rxjs';
import { EmployeeResponseType, EmployeeResponseTypeTable, EmployeeInfoResponseType } from '../model/response-type';
import { EmployeeLeaveInfoTable } from '../model/employee-leave-info-table';
// export class Employee {
//   constructor(
//     public empId: string,
//     public name: string,
//     public designation: string,
//     public salary: string
//   ) {}
// }

@Injectable({
  providedIn: "root"
})

export class HttpClientService {

  
  private employeeLeaveURl :string;
  private employeeLeaveList:string;
  private upload :string;
  private token :string;
  private empInfo:string;
  private leaveByYear:string;
  constructor(private httpClient: HttpClient) {
    this.employeeLeaveURl = "http://localhost:8080/employeeLeaveRequest";
    this.employeeLeaveList = "http://localhost:8080/employeeLeaveRequestList";
    this.upload = "http://localhost:8080/upload";
    this.token = sessionStorage.getItem('token');
    this.empInfo='http://localhost:8080/employeeDetails/';
    this.leaveByYear='http://localhost:8080/getLeaveByYear';
  }

  getEmployees() {
    return this.httpClient.get<EmployeeInfo[]>("http://localhost:8080/employees");
  }


  public getEmpLeaveListById(empId:string): Observable<EmployeeLeaveInfoTable[]> {
    console.log("empInfo "+ empId)  
    return this.httpClient.get<EmployeeLeaveInfoTable[]>("http://localhost:8080/employeeLeaveListById/"+`${empId}`);
  } 

  // public deleteEmployee(employee) {
  //   return this.httpClient.delete<EmployeeInfo>(
  //     "http://localhost:8080/employees" + "/" + employee.empId
  //   );
  // }
  

  public register(empDetails:EmployeeInfo): Observable<EmployeeInfoResponseType> {
    console.log(" *****EMPLOy INFO * "+JSON.stringify(empDetails));
    // String token=sessionStorage.getItem('token');
       
    var header = {
      headers: new HttpHeaders().set('Authorization',`${this.token}`)
    }
    // let header = new Headers({ 'Authorization': `${this.token}` });
     
    return this.httpClient.post<EmployeeInfoResponseType>(
     'http://localhost:8080/register',
      empDetails,header
    );
  }
  
  public getRegEmpList( empId:number): Observable<EmployeeInfo[]> {  
    var header = {
      headers: new HttpHeaders().set('Authorization',`${this.token}`)
    }  
    return this.httpClient.get<EmployeeInfo[]>(
     'http://localhost:8080/regEmpList'
    );
  }

  public generateExcelReport( year:string): Observable<HttpResponse<Blob>> {  
    // var header = {
    //   headers: new HttpHeaders().set('Authorization',`${this.token}`)
    // } 
    let headers = new HttpHeaders();
      
    headers = headers.append('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    return this.httpClient.get( 
      'http://localhost:8080/generateExcelReport/'+`${year}`,
     { headers: headers,
      observe: 'response',
      responseType: 'blob'
     }
      );
     
  }

  public getRegEmpDetail( empId:number): Observable<EmployeeInfo> {
    console.log("empId "+ empId)  
    var header = {
      headers: new HttpHeaders().set('Authorization',`${this.token}`)
    }  
    return this.httpClient.get<EmployeeInfo>(
      `${this.empInfo}${empId}`
    );
  }

  public addEmpRole( empInfo:EmployeeInfo): Observable<boolean> {
    console.log("empInfo "+ empInfo)  
    var header = {
      headers: new HttpHeaders().set('Authorization',`${this.token}`)
    }  
    return this.httpClient.post<boolean>(
      'http://localhost:8080/addEmpRole',empInfo,header
    );
  } 

  public getLeaveDetailByYear(year:string): Observable<Object[]> {
    console.log("empInfo "+ year)  
    var header = {
      headers: new HttpHeaders().set('Authorization',`${this.token}`)
    }  
    return this.httpClient.get<Object[]>(
      `${this.leaveByYear}/${year}`
    );
  } 


  public deleteEmpLeaveById(leaveInfo:EmployeeLeaveInfo): Observable<EmployeeLeaveInfoTable[]> {
    // console.log("empInfo "+ year)  
    var header = {
      headers: new HttpHeaders().set('Authorization',`${this.token}`)
    }  
    return this.httpClient.post<EmployeeLeaveInfoTable[]>(
      'http://localhost:8080/deleteEmpLeaveById',leaveInfo
    );
  } 



  public employeeLeaveRequest(employee:EmployeeLeaveInfo): Observable<EmployeeResponseTypeTable> {
    // public employeeLeaveRequest(employee:EmployeeLeaveInfo): Observable<boolean> {
    console.log(" *****EMPLOy INFO * "+JSON.stringify(employee));
    // String token=sessionStorage.getItem('token');
       
    var header = {
      headers: new HttpHeaders().set('Authorization',`${this.token}`)
    }
    // let header = new Headers({ 'Authorization': `${this.token}` });
     
    return this.httpClient.post<EmployeeResponseTypeTable>(
      `${this.employeeLeaveURl}`,
      employee,header
    );
  }


  public employeeLeaveRequestList(employeeLeaveList:EmployeeLeaveInfo[]): Observable<EmployeeResponseTypeTable> {
    console.log(" *****EMPLOy INFO * "+JSON.stringify(employeeLeaveList));
    // String token=sessionStorage.getItem('token');
       
    var header = {
      headers: new HttpHeaders().set('Authorization',`${this.token}`)
    }
    // let header = new Headers({ 'Authorization': `${this.token}` });
     
    return this.httpClient.post<EmployeeResponseTypeTable>(
      `${this.employeeLeaveList}`,
      employeeLeaveList,header
    );

    
  }

 
  //   uploadFile(file: File): Observable<HttpEvent<{}>> {
  //   // const header = {
  //     header: new HttpHeaders().set('Authorization',`${this.token}`)  ;
  //     // 'content-type': 'multipart/form-data'
  //   // } 
	// 	const formdata: FormData = new FormData();
	// 	formdata.append('file', file);
  //   const req = new HttpRequest('POST', `${this.upload}`, formdata,  
  //   {
  //       // headers:this.header,
	// 		  reportProgress: true,
	// 		  responseType: 'text'
  //   }
  //   ); 
	// 	return this.httpClient.request(req);
  //  }


   uploadFile(file: File, empId:string,uploadType:string): Observable<HttpEvent<{}>> {
    // const header = {
      header: new HttpHeaders().set('Authorization',`${this.token}`)  ;
      // 'content-type': 'multipart/form-data'
    // } 
		const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('empId', empId);
    formdata.append('uploadType', uploadType);
    const req = new HttpRequest('POST', `${this.upload}`, formdata,  
    {
        // headers:this.header,
			  reportProgress: true,
			  // responseType: 'text'
    }
    ); 
		return this.httpClient.request(req);
   }

  //  return this.httpClient.post<HttpEvent>(
  //   'http://localhost:8080/upload',header
  // );
  //  }


  
}
