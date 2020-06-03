import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { NgForm } from '@angular/forms';
import { ResponseAuthenticate } from 'src/app/model/response-type-authenticate';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
 
 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm') 
  public loginForm: NgForm;
  username = ''
  password = ''
  invalidLogin = false
  // authRespone:ResponseAuthenticate;
  @Input() error: string | null;

  constructor(private router: Router,
    private loginservice: AuthenticationService,private route: ActivatedRoute,private translate: TranslateService) { 
      // this.authRespone=new ResponseAuthenticate();
     
      
    }

  ngOnInit() {
    // this.translate.use('en');
    this.translate.addLangs(['en','ar']);  
    this.translate.setDefaultLang('ar')

    this.translate.use('ar');
    this.logOut();
  }

  checkLogin() {
    console.log(" LOGIN AUHENTIVATE")
    
    if(this.loginForm.valid){
      
    (this.loginservice.authenticate(this.username, this.password).subscribe(
    
      data => {
        //  if(sessionStorage.getItem("empinfo")===undefined ||sessionStorage.getItem("empinfo")===null){
        //   this.invalidLogin = true
        //    return this.error = "User Not Found. Invalid Credential"

        //  }
        console.log("Authentication Succuccful");
        console.log("Authentication DATA "+ JSON.stringify(data) );
        console.log(" USER ROLE :" +data.empInfo.role);
        // this.translate.use('en');
        if(data.empInfo.role==="EMP")
        this.router.navigate(['employeeLeave'])
        else if(data.empInfo.role==="ADM")
        this.router.navigate(['employeeLeave'])
        else if(data.empInfo.role==="MGR")
        this.router.navigate(['employeeLeave'])
        else  if(data.empInfo.role==="" ||data.empInfo.role===null || data.empInfo.role===undefined)
        this.router.navigate(['norole'])

       
        // this.authRespone=data.responseType; 
        //   if( this.authRespone.message=="INVALID_CREDENTIALS"){
        //     this.error="Invalid Credentials"
        //     this.invalidLogin = true;
        //   }

        this.invalidLogin = false




      }
        ,
        error => {

          console.log (sessionStorage.getItem("empId"))
          if(sessionStorage.getItem("empinfo")===undefined ||sessionStorage.getItem("empinfo")===null
          ||sessionStorage.getItem("empinfo").trim()===""){
            this.invalidLogin = true
             return this.error = "Invalid Credentials" 
           } 
           else
            return this.error = "Invalid Password"
          // this.invalidLogin = true
          // this.error = error.message;

        }
    )
    );
    }
  }

  register(){
    // return this.router.navigate(['/register'],{ relativeTo: this.route })
    return this.router.navigate(['register']);
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
