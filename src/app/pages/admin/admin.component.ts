import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService} from "../../service/httpclient.service";
import {EmployeeInfo} from "../../model/employee-info"
import { EmployeeLeaveInfo } from 'src/app/model/employee-leave-info';
import { HttpResponse } from '@angular/common/http';
import { FormControl, Validators, NgForm, FormGroup } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { DatePipe } from '@angular/common';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { TranslateService } from '@ngx-translate/core';
// import { LanguageUtil } from '../../../app/app.language';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

 
  @ViewChild('adminForm') 
  public adminForm: NgForm; 
  // public leaveForm: FormGroup;
  user: EmployeeInfo ;
  leaveInfo:EmployeeLeaveInfo;
  // selectFormControl = new FormControl('', [Validators.required]);
  // fromDateControl = new FormControl('', [Validators.required]);
  // toDateControl = new FormControl('', [Validators.required]);
  selectedFiles: FileList;
  currentFile: File;
  selectedFileName:string;
  // snackMsg:any;
  fileType:string
  fromDate:string;
  toDate:string; 
  fromDateValidation:boolean;
  toDateValidation:boolean;
  leaveTypeValidation:boolean;
  empInfoList:EmployeeInfo[];
  empInfo:EmployeeInfo;
  empId:number;
  addRoleStatus:boolean;
  submitStatusMsg:string;

  // language:LanguageUtil;
  
  // public validateControl(controlName: string) {
  //   if (this.leaveForm.controls[controlName].invalid && this.leaveForm.controls[controlName].touched)
  //     return true;
 
  //   return false;
  // }
 
  // public hasError(controlName: string, errorName: string) {
  //   if (this.leaveForm.controls[controlName].hasError(errorName))
  //     return true;
 
  //   return false;
  // }


  public validateControl() {

     
      if (this.leaveInfo.fromDate===null || this.leaveInfo.fromDate===undefined ) 
          return this.fromDateValidation=true;
        if (this.leaveInfo.toDate===null || this.leaveInfo.toDate===undefined ) 
           return this.toDateValidation=true;;
        if (this.leaveInfo.leaveType===null || this.leaveInfo.leaveType===undefined
          || this.leaveInfo.leaveType==="" ) 
             return  this.leaveTypeValidation=true;;
   
      return true;
    }

  // = new EmployeeLeave("", "", "", "");
  constructor(private httpClientService: HttpClientService,
    private router: Router,public datepipe: DatePipe,private _snackBar: MatSnackBar,
    private translate: TranslateService) {
      this.leaveInfo=new EmployeeLeaveInfo;
      this.user= new EmployeeInfo;
      this.empInfo =new EmployeeInfo();
      this.submitStatusMsg="";  
     }

  ngOnInit() {
    this.leaveInfo.empId=new Number(sessionStorage.getItem("empId")).valueOf();
    this.user.empName= sessionStorage.getItem("empName");
    this.user.empId=new Number(sessionStorage.getItem("empId")).valueOf();
    this.user.empName= sessionStorage.getItem("empName");
    this.user.role= sessionStorage.getItem("role");
    this.user.emailId= sessionStorage.getItem("emailId");
    this.user.mobileNo= sessionStorage.getItem("mobileNo");
    this.user.deptName= sessionStorage.getItem("deptName");
        // this.leaveForm = new FormGroup({
        //   selectFormControl: new FormControl('', [Validators.required]),
        //   fromDateControl: new FormControl(Date, [Validators.required]),
        //   toDateControl: new FormControl(Date, [Validators.required])
        // });
       
        
  }

  searchEmployeeById(){
    if (this.empId===null || this.empId===undefined )  {
      // return  this._snackBar.open("Please Enter Employee Id","",{duration:1500});

       this.translate.stream('pleaseEnterEmployeeId').subscribe((res: string) => {
        this.submitStatusMsg = res
    }); 
    return this._snackBar.open(this.submitStatusMsg,"",{duration:1500});
  }
    
    this.httpClientService.getRegEmpDetail(this.empId)
    .subscribe(data => {  
      
      if(data===null){
        // this._snackBar.open("Employee Not found","",{duration:1500}); 
        
    this.translate.stream('employeeNotFound').subscribe((res: string) => {
        this.submitStatusMsg = res
    }); 
    return this._snackBar.open(this.submitStatusMsg,"",{duration:1500});
        this.addRoleStatus=false;
        this.submitStatusMsg= "";
      } else{
        this.addRoleStatus=true;
        this.empInfo=data as EmployeeInfo;
        this.empId=undefined;
      }
      // console.log(this.empInfo)
      // alert("Employee leave request submitted successfully.");
     //  this.router.navigate(['employeeLeave'])
      });
  }

  addEmployeeRoles(){


    if(this.adminForm.valid){
      if(this.empInfo.role==="''")
        this.empInfo.role=null;
      this.httpClientService.addEmpRole(this.empInfo)
      .subscribe(data => {
        if(data===true){
          //  this.submitStatusMsg= "Roles Saved Successfully";
          this.translate.stream('rolesSavedSuccess').subscribe((res: string) => {
            this.submitStatusMsg = res
        });
        }else{
          //  this.submitStatusMsg= "Error Occured.";
          this.translate.stream('errorOccuredWhileSaving').subscribe((res: string) => {
            this.submitStatusMsg = res
        });
        }
        
          //  
        // console.log(this.empInfo) 
        });
    }
  }
  
   

   
  
  
  public dateValidator(event:any){
    console.log(event);
    console.log("***event value "+event.target.value);  
    this.toDateValidation=false;
    this.fromDateValidation=false;
      // added to avoid null values during validation process
      if(event.targetElement.name==="fromDate" && event.target.value===null) {
         this.leaveInfo.fromDate=undefined
         event.target.value===undefined;
         this.fromDateValidation=true;
      }
      if(event.targetElement.name==="toDate" && event.target.value===null){
        this.leaveInfo.toDate=undefined
        event.target.value===undefined;
        this.toDateValidation=true;
      }

      // added for validating end date should not be less than start date
      if((this.leaveInfo!=null && 
          this.leaveInfo.fromDate != null && this.leaveInfo.toDate !=null))
      {
        this.fromDate = this.datepipe.transform(this.leaveInfo.fromDate,"yyyy-MM-dd");
        this.toDate = this.datepipe.transform(this.leaveInfo.toDate,"yyyy-MM-dd"); 
         
        if(this.toDate < this.fromDate)
        {
          console.log("event.targetElement.name: "+event.targetElement.name)
          if(event.targetElement.name==="fromDate") {
            this.leaveInfo.fromDate=undefined
            this.fromDateValidation=true;
          }
          if(event.targetElement.name==="toDate"){
            this.leaveInfo.toDate=undefined
            this.toDateValidation=true;
          }
          event.target.value =undefined;
          event.value=undefined;
          
          // this.reportForm.setValue(invalid)
          // this._snackBar.open(this.language.datesValidationInDelgation.toString(),"",{duration:1500});
          // this._snackBar.open("From-Date is Greater than To-Date","",{duration:1500});

          this.translate.stream('fromGreaterThanToDate').subscribe((res: string) => {
            this.submitStatusMsg = res
        });

        this._snackBar.open(this.submitStatusMsg,"",{duration:1500});

          console.log(" *** event.value **"+event.value);
          console.log( this.adminForm);
          console.log(" *** event.value **");
          console.log(" *** event.value **");
          console.log(" *** event.value **");
          console.log( event);
          
        } 
      }
      console.log("***fromDate value "+ this.leaveInfo.fromDate);  
      console.log("***toDate value "+this.leaveInfo.toDate);  
    }


}
