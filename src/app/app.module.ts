import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
 
 
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';  
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
// import {MatRadioModule} from '@angular/material/radio';
import { FormsModule} from '@angular/forms'; 
// import { ReactiveFormsModule} from '@angular/forms'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatGridListModule} from '@angular/material/grid-list'; 
import {MatTableModule} from '@angular/material/table'; 
import {MatPaginatorModule} from '@angular/material/paginator'; 
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list'; 
import {MatDatepickerModule} from '@angular/material/datepicker'  ;
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common'; 

import { EmployeeLeaveComponent } from './pages/employee-leave/employee-leave.component';
import { EmployeeRegistrationComponent } from './pages/employee-registration/employee-registration.component';
import { LoginComponent } from './pages/login/login.component';
import {BasicAuthInterceptorService} from './service/basic-auth-interceptor.service';
import { LogoutComponent } from './pages/logout/logout.component'
import {MatCardModule} from '@angular/material/card';  
import {MatSelectModule} from '@angular/material/select'; 
// import { MatMomentDateModule } from "@angular/material-moment-adapter"; 

import { from } from 'rxjs';
import { AdminComponent } from './pages/admin/admin.component';
import { LeavedetailsComponent } from './pages/leavedetails/leavedetails.component';
import { RegisterComponent } from './pages/register/register.component';
import { ManageleaveComponent } from './pages/manageleave/manageleave.component'; 
import { HomeLayoutComponent } from './layouts/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { HeaderComponent } from './header/header.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MatExpansionModule} from '@angular/material/expansion'; 
// import { Platform } from '@ionic/angular';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [AppComponent,  
    EmployeeLeaveComponent,
    EmployeeRegistrationComponent,
    LoginComponent,
    LogoutComponent,
    AdminComponent,
    LeavedetailsComponent,
    RegisterComponent,
    ManageleaveComponent, 
    // FileSelectDirective ,
    HomeLayoutComponent,
    LoginLayoutComponent,
    HeaderComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // NoopAnimationsModule,
    HttpClientModule,
    // MatRadioModule,
    FormsModule,
    // ReactiveFormsModule, 
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatExpansionModule,
    // Platform,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide:HTTP_INTERCEPTORS,
      useClass:BasicAuthInterceptorService,
      multi:true,
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
