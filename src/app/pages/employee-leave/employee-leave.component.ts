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
import { from } from 'rxjs';
import { EmployeeResponseType, EmployeeResponseTypeTable } from 'src/app/model/response-type';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { EmployeeLeaveInfoTable } from 'src/app/model/employee-leave-info-table';
import { TranslateService, LangChangeEvent, TranslationChangeEvent } from '@ngx-translate/core';
// import { LanguageUtil } from '../../../app/app.language';
@Component({
  selector: 'app-employee-leave',
  templateUrl: './employee-leave.component.html',
  styleUrls: ['./employee-leave.component.scss']
})
export class EmployeeLeaveComponent implements OnInit {
  @ViewChild('reportForm') 
  public reportForm: NgForm; 
  // public leaveForm: FormGroup;
  user: EmployeeInfo ;
  leaveInfo:EmployeeLeaveInfo;
  responseEmpLeave:EmployeeLeaveInfoTable[];
  // selectFormControl = new FormControl('', [Validators.required]);
  // fromDateControl = new FormControl('', [Validators.required]);
  // toDateControl = new FormControl('', [Validators.required]);
  selectedFiles: FileList;
  currentFile: File;
  selectedFileName:string;
  msg:string;
  fileType:string
  fromDate:string;
  toDate:string; 
  fromDateValidation:boolean;
  toDateValidation:boolean;
  leaveTypeValidation:boolean;
  matSpinnerStatus = false;
  submitMsg:string;
  fromYear:number;
  toYear:number;
  yearDifference:number;
  fromMonth:number;
  responseType:EmployeeResponseType;
  responseTypetable:EmployeeResponseTypeTable;
toMonth:number;
leaveInfoCopy:EmployeeLeaveInfo;
leaveInfoList:EmployeeLeaveInfo[];
empId:string;
year:number;
empRole:string;
uploadType:string;
length = 100;
pageSize = 10;
pageSizeOptions: number[] = [5, 10, 25, 100];  
pageEvent: PageEvent; 
dataSource =new MatTableDataSource<Object>();
reportStatus:boolean;
isSearchData:boolean;
// displayedColumns: string[] = ['ID','EmpID', 'EmpName', 'FromDate', 'ToDate', 'LeaveType']; 
displayedColumns: string[] = ['EmpID', 'FromDate', 'ToDate', 'LeaveType','delete']; 
@ViewChild(MatPaginator) paginator: MatPaginator;
empInfo:EmployeeInfo;
isManager=false;
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
      console.log(" *** ***  consutructor values ")
      this.leaveInfo=new EmployeeLeaveInfo;
      this.user= new EmployeeInfo;
      this.submitMsg="";
      this.msg="";
      this.leaveInfoList= [];
      this.isSearchData=false;
      // this.empId=sessionStorage.getItem("empId");
      this.empInfo=new EmployeeInfo;
 
      // this.translate.onLangChange.subscribe((event: TranslationChangeEvent) => {
      //   this.translate.setDefaultLang(event.lang);
      // });
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
    this.roleName=sessionStorage.getItem('role');
    // console.log("INSIDE EMPLOYEE 23 " );
    this.translate.onLangChange.subscribe((event: LangChangeEvent) =>
    {
      console.log("INSIDE EMPLOYEE .ts" +event.lang );
      if(event.lang == 'ar') 
      {
        this.translate.use('ar');  
      } 
      else
      {
        this.translate.use('en');  
      }
      // added to call method when changing the language
      this.searchEmpListDetailsById();
    });
    if(this.roleName==="MGR")
      this.isManager=true;
    // this.empId=sessionStorage.getItem("empId");
        // this.leaveForm = new FormGroup({
        //   selectFormControl: new FormControl('', [Validators.required]),
        //   fromDateControl: new FormControl(Date, [Validators.required]),
        //   toDateControl: new FormControl(Date, [Validators.required])
        // });
        this.searchEmpListDetailsById();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; 
   }

   setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
  applyFilter(event: Event) {
   const filterValue = (event.target as HTMLInputElement).value;
   this.dataSource.filter = filterValue.trim().toLowerCase();
 }
  invalidEmpId=false;
  roleName:String;
 searchEmployeeById(value){
  this.empInfo=new EmployeeInfo; 
   console.log("entered searchEmployeeById ****" + value); 
   
        if (value===null ||  value===undefined)
        return;   
      // return  this._snackBar.open("Please Enter Employee Id","",{duration:1500});
    
    this.httpClientService.getRegEmpDetail(value)
    .subscribe(data => {  
      
      if(data===null){
        // this.leaveInfo.empId=Number(sessionStorage.getItem("empId"));
        this.invalidEmpId=true;
      } else{
        this.invalidEmpId=false;
        // this.addRoleStatus=true;
        this.empId=undefined; 
        this.empInfo=data as EmployeeInfo;
        
        console.log(this.empInfo);
      }
      // console.log(this.empInfo)
      // alert("Employee leave request submitted successfully.");
     //  this.router.navigate(['employeeLeave'])
      });
 }
 myFilter = (d: Date | null): boolean => {
  const day = (d || new Date()).getDay();
  // Prevent Saturday and Sunday from being selected.
  return day !== 0 && day !== 6;
}
readOnlyDates:string[];
  searchEmpListDetailsById(){
    this.empId=sessionStorage.getItem('empId');
    // let yearinString=this.year.toString();
    // if(this.manageForm.valid){
      this.matSpinnerStatus=true; 
      this.httpClientService.getEmpLeaveListById(this.empId)
      .subscribe(data => {
           console.log(" data ** "+ data)
            // this.empList=data as Object[]; 
            if(data!=null && data.length!==0){
              
              this.isSearchData=true;
              // this.dataSource.data= data as EmployeeLeaveInfo[];
              this.responseEmpLeave=data as EmployeeLeaveInfoTable[];

              for(var i=0;i<this.responseEmpLeave.length;i++){
                console.log(" *** ***  datasource values ")

                // this.readOnlyDates=this.responseEmpLeave[i].fromDate;
                // // this.myFilter =(d: Date | null): boolean => {
                //   // this.responseEmpLeave[i].fromDate
                //   // const day = (d || new Date()).getDay();
                  // // Prevent Saturday and Sunday from being selected.
                  // return day !== 0 && day !== 6;
                // }
                this.responseEmpLeave[i].fromDate = this.datepipe.transform(new Date(this.responseEmpLeave[i].fromDate),"dd-MMM-yyyy");
                this.responseEmpLeave[i].toDate = this.datepipe.transform(new Date(this.responseEmpLeave[i].toDate),"dd-MMM-yyyy");
                console.log ( "this.translate.currentLang "+ this.translate.currentLang)
                if(this.translate.currentLang=='en'){
                  if(this.responseEmpLeave[i].leaveType=="إجازة دوريه"){
                    this.responseEmpLeave[i].leaveType="Annual Leave"
                  }else if(this.responseEmpLeave[i].leaveType.trim()== "إجازة العمل الإضافي"){
                    this.responseEmpLeave[i].leaveType="Overtime Leave"
                  }else if(this.responseEmpLeave[i].leaveType=="الدورات"){
                    this.responseEmpLeave[i].leaveType="Course Leave"
                  }else if(this.responseEmpLeave[i].leaveType=="إجازة أمومة"){
                    this.responseEmpLeave[i].leaveType="Motherhood Leave"
                  }else if(this.responseEmpLeave[i].leaveType=="إجازة مرافق مريض"){
                    this.responseEmpLeave[i].leaveType="Sick Leave"
                  } 
                 
                }
                 console.log(this.responseEmpLeave[i].fromDate);
                 console.log(" DATE " + this.startDate);
                 
      
              }

              this.dataSource.data=this.responseEmpLeave;
                this.dataSource.paginator = this.paginator; 
            }else{  
                // this.msg="No Leave Request Submitted" 
                console.log(this.translate.langs);
                // this.msg=this.translate.instant('courseLeave');
                  this.translate.stream('noLeaveRequestedSubmitted').subscribe((res: string) => {
                      this.msg = res
                  });
                this.isSearchData=false;
            }
              this.matSpinnerStatus=false; 
             // this.empList=data as Object[][]; 
            // for(var i=0;i<this.empList.length;i++){
            //   for(var j=0;j<7;j++){ 
            //     console.log(" this.empList[i][j] "+this.empList[i][j])
            //     this.result[i]=this.empList[i][j];
            //   }
            // }
            // console.log(this.empList[0][1]) ;
  
  
            console.log( this.dataSource.data);
        });
    // }
  }
  
  
  public redirectToDetails = (id: string) => {
    
  }
 
  public redirectToUpdate = (id: string) => {
    
  }
 
  public redirectToDelete = (leaveInfo: EmployeeLeaveInfo) => {
    this.startDate = this.datepipe.transform(new Date(leaveInfo.fromDate),"dd-MM-yyyy");
    this.endDate = this.datepipe.transform(new Date(leaveInfo.toDate),"dd-MM-yyyy");
                
    leaveInfo.fromDate=new Date(this.startDate);
    leaveInfo.toDate=new Date(this.endDate);
    leaveInfo.updatedBy=sessionStorage.getItem("empId")
    this.httpClientService.deleteEmpLeaveById(leaveInfo)
    .subscribe(data =>
               {
 
                 
                if(data!=null && data.length!==0){
                  this.isSearchData=true;
                  // this.dataSource.data= data as EmployeeLeaveInfo[];
                  //   this.dataSource.paginator = this.paginator;

                  this.responseEmpLeave=data as EmployeeLeaveInfoTable[];

                  for(var i=0;i<this.responseEmpLeave.length;i++){
                    console.log(" datasource values ")
                     
                    this.responseEmpLeave[i].fromDate = this.datepipe.transform(new Date(this.responseEmpLeave[i].fromDate),"dd-MMM-yyyy");
                    this.responseEmpLeave[i].toDate = this.datepipe.transform(new Date(this.responseEmpLeave[i].toDate),"dd-MMM-yyyy");
                     
                    if(this.translate.currentLang=='en'){
                      if(this.responseEmpLeave[i].leaveType=="إجازة دوريه"){
                        this.responseEmpLeave[i].leaveType="Annual Leave"
                      }else if(this.responseEmpLeave[i].leaveType.trim()== "إجازة العمل الإضافي"){
                        this.responseEmpLeave[i].leaveType="Overtime Leave"
                      }else if(this.responseEmpLeave[i].leaveType=="الدورات"){
                        this.responseEmpLeave[i].leaveType="Course Leave"
                      }else if(this.responseEmpLeave[i].leaveType=="إجازة أمومة"){
                        this.responseEmpLeave[i].leaveType="Motherhood Leave"
                      }else if(this.responseEmpLeave[i].leaveType=="إجازة مرافق مريض"){
                        this.responseEmpLeave[i].leaveType="Sick Leave"
                      } 
                    }
          
                     console.log(this.responseEmpLeave[i].fromDate);
                     console.log(" DATE " + this.startDate);
                     
          
                  }
    
                  this.dataSource.data=this.responseEmpLeave;
                    this.dataSource.paginator = this.paginator; 
                
                }else{  
                    // this.msg="No Leave Applied Yet"
                    this.translate.stream('noLeaveRequestedSubmitted').subscribe((res: string) => {
                      this.msg = res
                  });
                    this.isSearchData=false;
                }
              });
              
  }


 
  employeeLeaveRequest(reportForm ) {
    
    console.log(" this.leaveInfo.leaveType "+ this.leaveInfo.leaveType)
    if (this.leaveInfo.fromDate===null || this.leaveInfo.fromDate===undefined ) 
        //  return   this.fromDateValidation=true;
        return  this._snackBar.open("from Date is required","",{duration:1500});
        if (this.leaveInfo.toDate===null || this.leaveInfo.toDate===undefined ) 
        // return  this.toDateValidation=true;;
        return this._snackBar.open("to Date is required","",{duration:1500});
        if (this.leaveInfo.leaveType===null || this.leaveInfo.leaveType===undefined
          || this.leaveInfo.leaveType==="" ) 
          // return  this.leaveTypeValidation=true;;
         return this._snackBar.open("Leave Type is required","",{duration:1500});
    if(this.reportForm.valid){
      
      this.validateControl(); 
      this.fromYear=this.leaveInfo.fromDate.getFullYear();
      this.leaveInfo.fromAppliedYear=this.fromYear.toString();
      this.leaveInfo.createdBy=sessionStorage.getItem("empId");
      this.httpClientService.employeeLeaveRequest(this.leaveInfo)
     .subscribe(data =>
              {
              //           if(data===true){
              //               this.submitMsg="Employee leave request submitted successfully.";
              //           }else{
              //               this.submitMsg=" Error Occured "; 
              //           } 
              // this.msg=""; 

                
              this.responseTypetable =data as EmployeeResponseTypeTable; 
              this.submitMsg=this.responseTypetable.message; 
              
              for(var i=0;i<this.responseTypetable.data.length;i++){
                console.log(" datasource values ")
                 
                this.responseTypetable.data[i].fromDate = this.datepipe.transform(new Date(this.responseTypetable.data[i].fromDate),"dd-MMM-yyyy");
                this.responseTypetable.data[i].toDate = this.datepipe.transform(new Date(this.responseTypetable.data[i].toDate),"dd-MMM-yyyy");
                //  if(this.translate.currentLang=='en'){
                //   if(this.responseTypetable.data[i].leaveType==="إجازة دوريه"){
                //     this.responseTypetable.data[i].leaveType==="Annual Leave"
                //   }else if(this.responseTypetable.data[i].leaveType==="إجازة العمل الإضافي"){
                //     this.responseTypetable.data[i].leaveType==="Overtime Leave"
                //   }else if(this.responseTypetable.data[i].leaveType==="الدورات"){
                //     this.responseTypetable.data[i].leaveType==="Course Leave"
                //   }else if(this.responseTypetable.data[i].leaveType==="إجازة أمومة"){
                //     this.responseTypetable.data[i].leaveType==="Motherhood Leave"
                //   }else if(this.responseTypetable.data[i].leaveType==="إجازة مرافق مريض"){
                //     this.responseTypetable.data[i].leaveType==="Sick Leave"
                //   }
                // }
                 console.log(this.responseTypetable.data[i].fromDate);
                 console.log("123  DATE " + this.startDate);
                 
      
              }

              if(this.responseTypetable.data!=null && this.responseTypetable.data.length!==0){
                this.isSearchData=true;
                this.dataSource.data= this.responseTypetable.data as EmployeeLeaveInfoTable[];
                  this.dataSource.paginator = this.paginator; 
              } 
                     
            this.msg=""; 


             });
    }
  }
   
  employeeLeaveRequestList(reportForm ) {
    console.log("entered e,ployee mplea *** "+this.isManager +"--- "+ this.invalidEmpId)
    if(this.isManager && this.invalidEmpId){
      this.leaveInfo=new EmployeeLeaveInfo;
      this.leaveInfo.empId=Number(sessionStorage.getItem("empId"));
      this.invalidEmpId=false;
     
      return  this._snackBar.open("Employee Id do not Exist","",{duration:1500});
    }
    console.log(" this.leaveInfo.leaveType "+ this.leaveInfo.leaveType)
    if (this.leaveInfo.fromDate===null || this.leaveInfo.fromDate===undefined ) 
        //  return   this.fromDateValidation=true;
        return  this._snackBar.open("from Date is required","",{duration:1500});
        if (this.leaveInfo.toDate===null || this.leaveInfo.toDate===undefined ) 
        // return  this.toDateValidation=true;;
        return this._snackBar.open("to Date is required","",{duration:1500});
        if (this.leaveInfo.leaveType===null || this.leaveInfo.leaveType===undefined
          || this.leaveInfo.leaveType==="" ) 
          // return  this.leaveTypeValidation=true;;
         return this._snackBar.open("Leave Type is required","",{duration:1500});
    if(this.reportForm.valid){
      
      this.validateControl();
      this.fromYear=this.leaveInfo.fromDate.getFullYear();
      this.toYear=this.leaveInfo.toDate.getFullYear();

      
      //  =new Array;
      console.log("  this.yearDifference " + this.fromYear + this.toYear);
      
        // if(this.fromYear !== this.toYear){
          this.yearDifference = this.toYear-this.fromYear;

          console.log(  this.yearDifference) 
        if(this.yearDifference>0){
          this.fromMonth=this.leaveInfo.fromDate.getMonth();
          this.toMonth=this.leaveInfo.toDate.getMonth();
          console.log("  this.monthDifference " + this.fromMonth + this.toMonth);
      

        for(var i=0;i<=this.yearDifference;i++){
         console.log("entered yearDifference");
          if(i===0){
            console.log("entered yearDifference i is o");
            this.leaveInfoCopy=new EmployeeLeaveInfo();
            this.leaveInfoCopy.toDate=new Date;
            this.leaveInfoCopy.fromDate=new Date; 

            this.leaveInfoCopy.empId=this.leaveInfo.empId;
            this.leaveInfoCopy.fromDate=this.leaveInfo.fromDate;
            this.leaveInfoCopy.toDate.setMonth(11);
            this.leaveInfoCopy.toDate.setFullYear(this.fromYear); 
            this.leaveInfoCopy.toDate.setHours(11);
            this.leaveInfoCopy.toDate.setMinutes(59);
            this.leaveInfoCopy.toDate.setSeconds(59); 
            this.leaveInfoCopy.toDate.setDate(31);
            this.leaveInfoCopy.leaveType =this.leaveInfo.leaveType.trim();
            this.leaveInfoCopy.fromAppliedYear=this.fromYear.toString();
            this.leaveInfoCopy.createdBy=sessionStorage.getItem("empId");
            // this.leaveInfoCopy.createdBy= this.leaveInfo.empId;
            // this.leaveInfoCopy.createdDate=new da
            // this.leaveInfoCopy.updatedBy=
            // this.leaveInfo.updatedDate=
            this.leaveInfoList[i]=this.leaveInfoCopy
          }

          if(i>0 && i<this.yearDifference){
            console.log("entered yearDifference i is > 1");
            this.leaveInfoCopy=new EmployeeLeaveInfo();
            this.leaveInfoCopy.toDate=new Date;
            this.leaveInfoCopy.fromDate=new Date;
            this.leaveInfoCopy.empId=this.leaveInfo.empId; 
            // this.leaveInfoCopy.toDate.setDate(31);
            this.leaveInfoCopy.toDate.setMonth(11);
            this.leaveInfoCopy.toDate.setFullYear(this.fromYear+ (i));
            this.leaveInfoCopy.toDate.setHours(0);
            this.leaveInfoCopy.toDate.setMinutes(0);
            this.leaveInfoCopy.toDate.setSeconds(0); 
            this.leaveInfoCopy.toDate.setDate(31);
            // this.leaveInfoCopy.fromDate.setDate(1);
            this.leaveInfoCopy.fromDate.setMonth(0);
            this.leaveInfoCopy.fromDate.setHours(0);
            this.leaveInfoCopy.fromDate.setMinutes(0);
            this.leaveInfoCopy.fromDate.setSeconds(0);
            this.leaveInfoCopy.fromDate.setMilliseconds(0); 
            this.leaveInfoCopy.fromDate.setDate(1);
            this.leaveInfoCopy.fromDate.setFullYear(this.fromYear+ (i));
            this.leaveInfoCopy.leaveType=this.leaveInfo.leaveType.trim();
            this.leaveInfoCopy.fromAppliedYear=this.fromYear.toString();
            this.leaveInfoCopy.createdBy=sessionStorage.getItem("empId");
            // this.leaveInfo.createdBy=sessionStorage.getItem("empId");

            this.leaveInfoList[i]=this.leaveInfoCopy
          }

          if(i===(this.yearDifference)){

            console.log("entered yearDifference last i");
            this.leaveInfoCopy=new EmployeeLeaveInfo();
            this.leaveInfoCopy.toDate=new Date;
            this.leaveInfoCopy.fromDate=new Date;

            this.leaveInfoCopy.empId=this.leaveInfo.empId; 
            this.leaveInfoCopy.fromDate.setFullYear(this.toYear);
            // this.leaveInfoCopy.fromDate.setDate(1);
            this.leaveInfoCopy.fromDate.setMonth(0);
            this.leaveInfoCopy.fromDate.setHours(12);
            this.leaveInfoCopy.fromDate.setMinutes(0);
            this.leaveInfoCopy.fromDate.setSeconds(0);
            this.leaveInfoCopy.fromDate.setDate(1);
            this.leaveInfoCopy.toDate=this.leaveInfo.toDate;
            this.leaveInfoCopy.leaveType=this.leaveInfo.leaveType.trim(); 
            this.leaveInfoCopy.fromAppliedYear=this.fromYear.toString();
            this.leaveInfoCopy.createdBy=sessionStorage.getItem("empId");
console.log ("   this.leaveInfoList[i] ");
console.log(   this.leaveInfoList[i]);
            this.leaveInfoList[i]=this.leaveInfoCopy
          } 
        }
        console.log("LEAVE INFO LIST");
        console.log(this.leaveInfoList);
          
        }
        else{
         
          this.leaveInfo.fromAppliedYear=this.fromYear.toString(); 
          this.leaveInfo.createdBy=sessionStorage.getItem("empId");
          this.leaveInfoList[0]=this.leaveInfo;

        }

      // }

        this.httpClientService.employeeLeaveRequestList(this.leaveInfoList)
   .subscribe(data =>
              {

                
                // this.responseType =data as EmployeeResponseType; 
                //             this.submitMsg=this.responseType.message; 
                // if(data.data!=null && data.data.length!==0){
                //   this.isSearchData=true;
                //   this.dataSource.data= data.data as EmployeeLeaveInfo[];
                //     this.dataSource.paginator = this.paginator; 
                // } 

                this.responseTypetable =data as EmployeeResponseTypeTable; 
                this.submitMsg=this.responseTypetable.message; 
                
                for(var i=0;i<this.responseTypetable.data.length;i++){
                  console.log(" datasource values ")
                  if(this.responseTypetable.data[i].leaveType===null)
                  continue;
                  this.responseTypetable.data[i].fromDate = this.datepipe.transform(new Date(this.responseTypetable.data[i].fromDate),"dd-MMM-yyyy");
                  this.responseTypetable.data[i].toDate = this.datepipe.transform(new Date(this.responseTypetable.data[i].toDate),"dd-MMM-yyyy");
                  if(this.translate.currentLang=='en'){
                    if(this.responseTypetable.data[i].leaveType=="إجازة دوريه"){
                      this.responseTypetable.data[i].leaveType="Annual Leave"
                    }else if(this.responseTypetable.data[i].leaveType.trim()=="إجازة العمل الإضافي"){
                      this.responseTypetable.data[i].leaveType="Overtime Leave"
                    }else if(this.responseTypetable.data[i].leaveType=="الدورات"){
                      this.responseTypetable.data[i].leaveType="Course Leave"
                    }else if(this.responseTypetable.data[i].leaveType=="إجازة أمومة"){
                      this.responseTypetable.data[i].leaveType="Motherhood Leave"
                    }else if(this.responseTypetable.data[i].leaveType==="إجازة مرافق مريض"){
                      this.responseTypetable.data[i].leaveType="Sick Leave"
                    }
                  }
        
                   console.log(this.responseTypetable.data[i].fromDate);
                   console.log(" DATE " + this.startDate);
                   
        
                }

                if(this.responseTypetable.data!=null && this.responseTypetable.data.length!==0){
                  this.isSearchData=true;
                  this.dataSource.data= this.responseTypetable.data as EmployeeLeaveInfoTable[];
                    this.dataSource.paginator = this.paginator; 
                } 
                       
              this.msg=""; 
             });
     

      // For Same Year
  //  this.httpClientService.employeeLeaveRequest(this.leaveInfo)
  //  .subscribe(data =>
  //             {
  //                       if(data===true){
  //                           this.submitMsg="Employee leave request submitted successfully.";
  //                       }else{
  //                           this.submitMsg=" Error Occured "; 
  //                       } 
  //             this.msg=""; 
  //            });
    }
  }
  selectFile(event) {
    console.log(event); 
    // this.fileType=event.target.files.FileList(1).File(0);
    this.submitMsg="";
    this.msg="";
        this.selectedFiles = event.target.files ;
     if(this.selectedFiles.item(0).type=== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
        console.log("selectedFiles type "+ this.selectedFiles.item(0).type )
        this.selectedFileName=this.selectedFiles.item(0).name;
    }else{
      this.selectedFiles=null;
      this.selectedFileName="";
      // this.msg = "Supported File: Excel";
      this.translate.stream('unsupportedFile').subscribe((res: string) => {
        this.msg = res
    });
    }
    
  }

  

  upload(uploadType:any) { 
    this.currentFile = this.selectedFiles.item(0);  
      this.empId=sessionStorage.getItem('empId');
    console.log(this.currentFile);
    this.matSpinnerStatus=true;
    this.httpClientService.uploadFile(this.currentFile,this.empId,uploadType).subscribe(response => {
		// this.selectedFiles = '';
     if (response instanceof HttpResponse) {
    //  this.msg = response.body;
    this.responseTypetable = response.body as EmployeeResponseTypeTable;
    console.log("this.responseType.status***" + this.responseTypetable.code )
     if(this.responseTypetable.status===true){
       console.log("this.responseType.status***" + this.responseTypetable.status)
      this.msg="File Uploaded Successfully";
      if(this.responseTypetable.data!=null && this.responseTypetable.data.length!==0){
        

        for(var i=0;i<this.responseTypetable.data.length;i++){
          console.log(" datasource values ")
           
          this.responseTypetable.data[i].fromDate = this.datepipe.transform(new Date(this.responseTypetable.data[i].fromDate),"dd-MMM-yyyy");
          this.responseTypetable.data[i].toDate = this.datepipe.transform(new Date(this.responseTypetable.data[i].toDate),"dd-MMM-yyyy");
           
          if(this.translate.currentLang=='en'){
            if(this.responseTypetable.data[i].leaveType=="إجازة دوريه"){
              this.responseTypetable.data[i].leaveType="Annual Leave"
            }else if(this.responseTypetable.data[i].leaveType.trim()=="إجازة العمل الإضافي"){
              this.responseTypetable.data[i].leaveType="Overtime Leave"
            }else if(this.responseTypetable.data[i].leaveType=="الدورات"){
              this.responseTypetable.data[i].leaveType="Course Leave"
            }else if(this.responseTypetable.data[i].leaveType=="إجازة أمومة"){
              this.responseTypetable.data[i].leaveType="Motherhood Leave"
            }else if(this.responseTypetable.data[i].leaveType==="إجازة مرافق مريض"){
              this.responseTypetable.data[i].leaveType="Sick Leave"
            } 
            
          }

           console.log(this.responseTypetable.data[i].fromDate);
           console.log(" DATE " + this.startDate);
           

        }

        this.isSearchData=true;
        this.dataSource.data= this.responseTypetable.data as EmployeeLeaveInfoTable[];
          this.dataSource.paginator = this.paginator;
      
      }
       
     }else{
      this.msg="Unsuccessful Error Occured"; 
     }
     this.matSpinnerStatus=false;
        console.log(response.body);
      }	  
    });    
  }
   startDate:string;
   endDate:string;

  // upload() { 
  //   this.currentFile = this.selectedFiles.item(0);
  //   console.log(this.currentFile);
  //   this.matSpinnerStatus=true;
  //   this.httpClientService.uploadFile(this.currentFile).subscribe(response => {
	// 	// this.selectedFiles = '';
  //    if (response instanceof HttpResponse) {
  //    this.msg = response.body;
  //    if(this.msg){
  //     this.msg="File Uploaded Successfully";
  //    }else{
  //     this.msg="Unsuccessful Error Occured";

  //    }
  //    this.matSpinnerStatus=false;
  //       console.log(response.body);
  //     }	  
  //   });    
  // }


 
  // employeeUpload() {
  //     this.currentFile = this.selectedFiles.item(0);
  //     console.log(this.currentFile);
  //     this.matSpinnerStatus=true;
      
      

  //     this.httpClientService.uploadFile(this.currentFile,this.empId,this.year,this.uploadType).subscribe(response => {
  //     // this.selectedFiles = '';
  //      if (response instanceof HttpResponse) {
  //      this.msg = response.body;
  //      if(this.msg){
  //       this.msg="File Uploaded Successfully";
  //      }else{
  //       this.msg="Unsuccessful Error Occured";
  
  //      }
  //      this.matSpinnerStatus=false;
  //         console.log(response.body);
  //       }	  
  //     });    
  //   }


  // newUpload() {
  //   this.currentFile = this.selectedFiles.item(0);
  //   console.log(this.currentFile);
  //   this.matSpinnerStatus=true;
  //   this.httpClientService.uploadFile2(this.currentFile,this.empId,this.year,this.role, this.uploadType)
  //   .subscribe(response => {
	// 	// this.selectedFiles = '';
  //    if (response instanceof HttpResponse) {
  //    this.msg = response.body;
  //    if(this.msg){
  //     this.msg="File Uploaded Successfully";
  //    }else{
  //     this.msg="Unsuccessful Error Occured";

  //    }
  //    this.matSpinnerStatus=false;
  //       console.log(response.body);
  //     }	  
  //   });    
  // }


  // amendUpload() {
  //   this.currentFile = this.selectedFiles.item(0);
  //   console.log(this.currentFile);
  //   this.matSpinnerStatus=true;
  //   this.httpClientService.uploadFile2(this.currentFile,this.empId,this.year,this.role, this.uploadType)
  //   .subscribe(response => {
	// 	// this.selectedFiles = '';
  //    if (response instanceof HttpResponse) {
  //    this.msg = response.body;
  //    if(this.msg){
  //     this.msg="File Uploaded Successfully";
  //    }else{
  //     this.msg="Unsuccessful Error Occured";

  //    }
  //    this.matSpinnerStatus=false;
  //       console.log(response.body);
  //     }	  
  //   });    
  // }

  
  // this.leaveForm.controls['fromDateControl']
  // public dateValidator(event:any){
  //   console.log(event);
  //   console.log("***event value "+event.target.value);  
     
  //     // added to avoid null values during validation process
  //     if(event.targetElement.name==="fromDate" && event.target.value===null) {
  //        this.leaveForm.controls['fromDateControl']=undefined
  //        event.target.value===undefined;
  //     }
  //     if(event.targetElement.name==="toDate" && event.target.value===null){
  //       this.leaveForm.controls['toDateControl']=undefined
  //       event.target.value===undefined;
  //     }

  //     // added for validating end date should not be less than start date
  //     if((
  //         this.leaveForm.controls['fromDateControl'] != null && this.leaveForm.controls['toDateControl'] !=null))
  //     {
  //       this.fromDate = this.datepipe.transform(this.leaveForm.controls['fromDateControl'].value,"yyyy-MM-dd");
  //       this.toDate = this.datepipe.transform(this.leaveForm.controls['toDateControl'].value,"yyyy-MM-dd"); 
         
  //       if(this.toDate < this.fromDate)
  //       {
  //         if(event.targetElement.name==="fromDate") 
  //           this.leaveForm.controls['fromDateControl']=undefined
  //         if(event.targetElement.name==="toDate")
  //           this.leaveForm.controls['toDateControl']=undefined
  //         event.target.value =undefined;
          
  //         // this._snackBar.open(this.language.datesValidationInDelgation.toString(),"",{duration:1500});
  //         this._snackBar.open("From-Date is Greater than To-Date","",{duration:1500});
  //       } 
  //     }
  //     console.log("***fromDate value "+ this.leaveForm.controls['fromDateControl']);  
  //     console.log("***toDate value "+this.leaveForm.controls['toDateControl']);  
  //   }
  public dateValidator(event:any){
    console.log(event);
    console.log("***event value "+event.target.value);  
    this.toDateValidation=false;
    this.fromDateValidation=false;
      // added to avoid null values during validation process
      if(event.targetElement.name==="fromDate" && event.target.value===null) {
         this.leaveInfo.fromDate=undefined
         this.leaveInfo.toDate=undefined; // to make both from and To inputs empty
         event.target.value===undefined;
         this.fromDateValidation=true;
      }
      if(event.targetElement.name==="toDate" && event.target.value===null){
        this.leaveInfo.toDate=undefined
        this.leaveInfo.fromDate=undefined // to make both from and To inputs empty
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
            this.leaveInfo.toDate=undefined
            this.fromDateValidation=true;
          }
          if(event.targetElement.name==="toDate"){
            this.leaveInfo.toDate=undefined
            this.leaveInfo.fromDate=undefined
            this.toDateValidation=true;
          }
          event.target.value =undefined;
          event.value=undefined;
          
          // this.reportForm.setValue(invalid)
          // this._snackBar.open(this.language.datesValidationInDelgation.toString(),"",{duration:1500});
          this._snackBar.open("From-Date is Greater than To-Date","",{duration:1500});
          console.log(" *** event.value **"+event.value);
          console.log( this.reportForm);
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
