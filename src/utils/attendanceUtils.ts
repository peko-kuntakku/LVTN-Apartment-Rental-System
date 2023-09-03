import { AttendanceListItemModel } from "../model/Attendance";

export function transformAttendanceListData(resData: any) {
    return resData.map((ele: any, index: number) => {
        const employee = ele.attributes.employee.data;
        const item: AttendanceListItemModel = {
            index: index + 1,
            id: ele.id,
            status: ele.attributes.Status,
            day: ele.attributes.Day,
            employeeId: employee.id ? employee.id : undefined,
            name: (employee.attributes.Firstname && employee.attributes.Lastname)
                ? `${employee.attributes.Lastname} ${employee.attributes.Firstname}`
                : '_',
        }
        return item;
    });
}

export function getAttendanceResultStatusText(status: number) {
    switch (status) {
        case 0:
            return 'Có mặt';
        case 1:
            return 'Vào trễ';
        case 2:
            return 'Vắng không phép';
        case 3:
            return 'Vắng có phép (Chờ xác nhận)';
        case 4:
            return 'Vắng có phép (Đã xác nhận)';
        default: 
            return '';
    }
}