import { EmployeeInfo } from './employee-info';
import { EmployeeLeaveInfo } from './employee-leave-info';
import { EmployeeLeaveInfoTable } from './employee-leave-info-table';

 

export class ResponseAuthenticate {
    status: Boolean;
    code:number;
    message:string;
    data: Object;
    count:number;
}

 
 