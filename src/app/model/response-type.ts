import { EmployeeInfo } from './employee-info';
import { EmployeeLeaveInfo } from './employee-leave-info';
import { EmployeeLeaveInfoTable } from './employee-leave-info-table';

 

export class EmployeeResponseType {
    status: Boolean;
    code:number;
    message:string;
    data: EmployeeLeaveInfo[];
    count:number;
}


export class EmployeeResponseTypeTable {
    status: Boolean;
    code:number;
    message:string;
    data: EmployeeLeaveInfoTable[];
    count:number;
} 


export class EmployeeInfoResponseType {
    status: Boolean;
    code:number;
    message:string;
    data: EmployeeInfo[];
    count:number;
}
 