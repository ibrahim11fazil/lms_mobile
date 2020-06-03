import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) {}
  // Provide username and password for authentication, and once authentication is successful, 
  //store JWT token in session
    authenticate(username, password) {
      return this.httpClient
        .post<any>("http://localhost:8080/authenticate", { username, password })
        .pipe(
          map(userData => {
            console.log(" userData roles "+  JSON.stringify(userData) +"**"+userData.empInfo.role);
            sessionStorage.setItem("username", username);
            let tokenStr = "Bearer " + userData.token;
            sessionStorage.setItem("empinfo", userData.empInfo);
            sessionStorage.setItem("token", tokenStr);
            sessionStorage.setItem("empId",userData.empInfo.empId);
            sessionStorage.setItem("empName",userData.empInfo.empName);
            sessionStorage.setItem("role",userData.empInfo.role);
            sessionStorage.setItem("emailId",userData.empInfo.emailId);
            sessionStorage.setItem("mobileNo",userData.empInfo.mobileNo);
            sessionStorage.setItem("deptName",userData.empInfo.deptName);

            return userData;
          })
        );
    }
  
    isUserLoggedIn() {
      let user = sessionStorage.getItem("username");
      console.log(!(user === null));
      return !(user === null);
    }
  
    logOut() {
            sessionStorage.removeItem("username"); 
            sessionStorage.removeItem("empinfo");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("empId");
            sessionStorage.removeItem("empName");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("emailId");
            sessionStorage.removeItem("mobileNo");
            sessionStorage.removeItem("deptName");
    }
}
