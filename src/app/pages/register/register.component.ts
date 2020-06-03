import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from 'src/app/service/httpclient.service';
import { EmployeeInfo } from 'src/app/model/employee-info';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeInfoResponseType } from 'src/app/model/response-type';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('registerForm') 
  public registerForm: NgForm; 
  empInfo:EmployeeInfo;
  confirmpwd:string;
  registerStatus:boolean;
  constructor(private httpClientService: HttpClientService,
    private router: Router,private route: ActivatedRoute,private _snackBar: MatSnackBar) { }

  ngOnInit(): void { 
    this.empInfo =new EmployeeInfo;
  }

  goToLoginPage(){
    this.router.navigate(['login']);
  }
user:string[]
emailToSplit:string;
empIdExists=false;
emailIdExists=false;
empInfoResponseType:EmployeeInfoResponseType;
  registerEmployee(registerForm){
    // if(this.empInfo.password!==this.confirmpwd){
    //   this.empInfo.password="";
    //   this.confirmpwd="";
    //   return this._snackBar.open("Password do not match, Please re-enter.","",{duration:1500});
         
    // }
   
    if(this.registerForm.valid){
      // this.emailToSplit=this.empInfo.emailId;
      // this.user=this.emailToSplit.split("@");
      // this.empInfo.empName=this.user[0].trim();
      console.log(  "    this.empInfo.empName "+   this.empInfo.empName);
      this.empInfo.password="12341234";
      this.httpClientService.register(this.empInfo)
      .subscribe(data => {

        // this.registerStatus=data; 
        // if(this.registerStatus){
        //   this.empInfo=new EmployeeInfo;
        //   this.confirmpwd="";
        //   this._snackBar.open("Registration Successful. Please Login","",{duration:1500});
        //   this.router.navigate(['login']);
        // }
        
        this.empInfoResponseType=data;
        console.log(this.empInfoResponseType);
        if(this.empInfoResponseType!=null){
            if(this.empInfoResponseType.status===true){
              this._snackBar.open("Registration Successful. Please Login","",{duration:1500});
              this.empInfo.emailId=""; 
              // this.router.navigate(['login']);
            }else if(this.empInfoResponseType.data!=null && this.empInfoResponseType.data.length!=0){
               
              for(var i=0 ;i<this.empInfoResponseType.data.length ;i++){
                console.log("console.log(this.empInfoResponseType) " +this.empInfo.empId);
                console.log("console.log(this.empInfoResponseType); " +this.empInfoResponseType.data[i].empId);
                    if(this.empInfo.empId ==this.empInfoResponseType.data[i].empId){ 
                      console.log("entered emp ID test");
                      this.empInfo.empId=null;
                      this.empIdExists=true;
                    }
                    if(this.empInfo.emailId=== this.empInfoResponseType.data[i].emailId){
                      console.log("entered email ID test");
                      this.empInfo.emailId=""; 
                      this.emailIdExists=true;
                    }
                }

                if(this.empIdExists && this.emailIdExists ){
                   // this.empEmailIdExists=true;
                   this._snackBar.open("Employee Id and Email Id is already registered","",{duration:1500});
                    
                }else if(this.empIdExists){
                  this._snackBar.open("Employee Id is already registered","",{duration:1500});

                }else if(this.emailIdExists){
                  this._snackBar.open("Email Id is already registered","",{duration:1500});

                }

            }
        }

        console.log(this.empInfo) 
        });
    }
  }
}
