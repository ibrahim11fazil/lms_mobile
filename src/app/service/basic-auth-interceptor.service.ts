import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';


@Injectable()
export class BasicAuthInterceptorService  implements HttpInterceptor {
  private token :string;
  constructor() {
    this.token = sessionStorage.getItem('token');
   }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (sessionStorage.getItem('username') && sessionStorage.getItem('token')) {
      console.log("At session Http Interceptor service "+ sessionStorage.getItem('token'));
      req = req.clone({
        setHeaders: {
          Authorization: sessionStorage.getItem('token')
        //   'Content-Type' : 'application/json; charset=utf-8',
        // 'Accept'       : 'application/json',
        // 'Authorization': `${this.token}`,
        }
      })
    }

    return next.handle(req);

  }
}
