import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMultiYearView, MatYearView, MatCalendar } from '@angular/material/datepicker';
import { AutofillEvent } from '@angular/cdk/text-field';
import { ListRange } from '@angular/cdk/collections';
import { NgForm } from '@angular/forms';
import { HttpClientService } from 'src/app/service/httpclient.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as fileSaver from 'file-saver'; 
import { EmployeeInfo } from 'src/app/model/employee-info';
import { EmployeeLeaveInfo } from 'src/app/model/employee-leave-info';
import { HttpResponse } from '@angular/common/http';
import { EmployeeResponseType } from 'src/app/model/response-type';
import { TranslateService } from '@ngx-translate/core';
// import { MatTableDataSource,MatPaginator,PageEvent  } from '@angular/material';

@Component({
  selector: 'app-manageleave',
  templateUrl: './manageleave.component.html',
  styleUrls: ['./manageleave.component.scss']
})
export class ManageleaveComponent implements OnInit { 
  constructor(private httpClientService: HttpClientService,
    private router: Router,public datepipe: DatePipe,private _snackBar: MatSnackBar,private translate: TranslateService) { 
      this.leaveInfo=new EmployeeLeaveInfo;
      this.user= new EmployeeInfo;
      this.submitMsg=""; 
      this.msg=""; 
      this.msg1="";
      this.empId=""; 
      this.empRole=""; 
    this.isSearchData=false;
  }

  @ViewChild('manageForm') 
  public manageForm: NgForm; 
year:number;
index:number;
yearList:number[]; 
empList:Object[];
result:Object[];
matSpinnerStatus = false;
matSpinnerUploadStatus =false;
msg:any;
msg1:any;
selectedFiles: FileList;
currentFile: File;
selectedFileName:string;
submitMsg:string; 
empId:string; 
empRole:string; 

// yearList:Date[];

// displayedColumns: string[] = ['id' ,'Deptname','EmpID', 'EmpName', 'FromDate', 'ToDate', 'LeaveType']; 
displayedColumns: string[] = ['EmpID','EmpName','Deptname',  'FromDate', 'ToDate', 'LeaveType']; 
@ViewChild(MatPaginator) paginator: MatPaginator;
// pageEvent: PageEvent; 
 // MatPaginator Inputs
 user: EmployeeInfo ;
 leaveInfo:EmployeeLeaveInfo;
 length = 100;
 pageSize = 10;
 pageSizeOptions: number[] = [5, 10, 25, 100];  
 pageEvent: PageEvent; 
 dataSource =new MatTableDataSource<Object>();
 reportStatus:boolean;
 isSearchData:boolean;
  ngOnInit(): void {
    this.leaveInfo.empId=new Number(sessionStorage.getItem("empId")).valueOf();
    this.user.empName= sessionStorage.getItem("empName");
    this.user.empId=new Number(sessionStorage.getItem("empId")).valueOf();
    this.user.empName= sessionStorage.getItem("empName");
    this.user.role= sessionStorage.getItem("role");
    this.user.emailId= sessionStorage.getItem("emailId");
    this.user.mobileNo= sessionStorage.getItem("mobileNo");
    this.user.deptName= sessionStorage.getItem("deptName");
    
   this.year=new Date().getFullYear();
   this.index=0;
   this.yearList=[this.index];
   this.result=[];
  //  this.empList=[][];

   for(var i =2000;i<this.year+3;i++){
    this.yearList[this.index++]=i;
  
  }
     console.log("Year List " + this.yearList)
    //  this.searchLeaveDetails(); 
  }


  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; 
   }
getYearList(){
    
  
}

selectFile(event) {
  console.log(event); 
  // this.fileType=event.target.files.FileList(1).File(0);
  this.submitMsg="";
  this.msg="";
  this.msg1="";
      this.selectedFiles = event.target.files ;
   if(this.selectedFiles.item(0).type=== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
      console.log("selectedFiles type "+ this.selectedFiles.item(0).type )
      this.selectedFileName=this.selectedFiles.item(0).name;
  }else{
    this.selectedFiles=null;
    this.selectedFileName="";
    this.msg = "Supported File: Excel";
  }
  
}
responseType:EmployeeResponseType;
upload( uploadType:any) {   
  this.currentFile = this.selectedFiles.item(0);
  console.log(this.currentFile);
  this.matSpinnerUploadStatus=true;
  this.empId=sessionStorage.getItem('empId');
  this.httpClientService.uploadFile(this.currentFile,this.empId,uploadType).subscribe(response => {
  // this.selectedFiles = ''; 
  this.selectedFiles= null;
   if (response instanceof HttpResponse) {
  //  this.msg = response.body;
  //  if(response.body==="true"){
    this.responseType = response.body as EmployeeResponseType;
    console.log("this.responseType.status***" + this.responseType.code )
     if(this.responseType.status===true){
      console.log("this.responseType.status***" + this.responseType.status)
      this.msg1="File Uploaded Successfully"; 
     }else{
      this.msg1="Unsuccessful Error Occured"; 
     }
  //   this.msg1="File Uploaded Successfully";
  //  }else{
  //   this.msg1="Unsuccessful Upload. Error Occured"; 
  //  }
   this.matSpinnerUploadStatus=false;
      console.log(response.body);
    }	  
  });    
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

searchLeaveDetails(){
  let yearinString=this.year.toString();
  if(this.manageForm.valid){
    this.matSpinnerStatus=true; 
    this.httpClientService.getLeaveDetailByYear(yearinString)
    .subscribe(data => {
         console.log(" data ** "+ data)
          // this.empList=data as Object[]; 
          if(data!=null && data.length!==0){
            this.isSearchData=true;
            
           this.empList=data as Object[]; 
          //  this.empList=data as Object[][]; 
            for(var i=0;i<this.empList.length;i++){
              // for(var j=0;j<7;j++){ 
                console.log(" this.empList[i][j] "+this.empList[i][1])
                // if(this.empList[i][1]=="null" || this.empList[i][1]=="" || this.empList[i][1]==undefined)
                // continue;
                if(!Object.keys(this.empList[i][1]).length)
                continue;
                   this.empList[i][4] = this.datepipe.transform(new Date(this.empList[i][4]),"dd-MMM-yyyy");
                   this.empList[i][5] = this.datepipe.transform(new Date(this.empList[i][5]),"dd-MMM-yyyy");
            
                // this.result[i]=this.empList[i] 
              // }
              if(this.translate.currentLang=='en'){
                if(this.empList[i][1]=="البرمجيات"){
                  this.empList[i][1]="Software"
                }else if(this.empList[i][1]=="الدعم الفني"){
                  this.empList[i][1]="Technical Support"
                }else if(this.empList[i][1]=="الشبكات"){
                  this.empList[i][1]="Networks"
                }else if(this.empList[i][1]=="المكتب الإداري"){
                  this.empList[i][1]="Administrative Office"
                } 
                } 


            }
        

          // this.dataSource.data= data as Object[];
          this.dataSource.data= this.empList;
          this.dataSource.paginator = this.paginator;
          
          }else{
            this.msg="No Data Found"
            this.isSearchData=false;
          }
            this.matSpinnerStatus=false; 
       
          // console.log(this.empList[0][1]) ;

          // for(var i=0;i<this.responseTypetable.data.length;i++){
          //   console.log(" datasource values ")
             
          //   this.responseTypetable.data[i].fromDate = this.datepipe.transform(new Date(this.responseTypetable.data[i].fromDate),"dd-MMM-yyyy");
          //   this.responseTypetable.data[i].toDate = this.datepipe.transform(new Date(this.responseTypetable.data[i].toDate),"dd-MMM-yyyy");
             
  
          //    console.log(this.responseTypetable.data[i].fromDate);
          //    console.log(" DATE " + this.startDate);
             
  
          // }


          console.log( this.dataSource.data);
      });
  }
}


generateExcelReport(){
  this.matSpinnerStatus=true; 
  let yearinString=this.year.toString();
  this.httpClientService.generateExcelReport(yearinString)
  .subscribe(data => {
        
        // this.reportStatus= data  ;
        if(data!=null){
          const filename = data.headers.get('filename'); 
          this.saveExcelFile(data.body, filename);
          this.matSpinnerStatus=false; 
        }else{
          this.msg="No Data Found"
        }
        //  if(this.reportStatus)
        //   this.msg="Report Generated SuccessFully";
        //  else
        //   this.msg="Failed to generate report";

        console.log( this.reportStatus);

  })
}

saveExcelFile(data: any, filename?: string) { 
  const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  fileSaver.saveAs(blob, "Employees_Leave_Details"+".xlsx");

}


}