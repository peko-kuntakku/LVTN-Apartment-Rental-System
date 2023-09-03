import { EditEmployeeDetailModel, EmployeeListItemModel } from "../model/Employee";
import { currencyFormatter } from "./utils";

export function transformEmployeeListData(resData: any) {
    return resData.map((ele: any, index: number) => {
        const profile = ele.employeeInfo;
        const item: EmployeeListItemModel = {
            index: index + 1,
            id: ele.id,
            email: ele.email,
            name: profile ? `${profile.Lastname} ${profile.Firstname}`: '_' ,
            role: profile ? profile.Role : '_',
            salary: profile?.Salary ? currencyFormatter.format(profile.Salary) : '_',
            profileId: profile ? profile.id : undefined,
            shift: profile ? `Ca ${profile.Shift}` : '_',
            workingDays: profile ? transformWorkingDay(profile.WorkingDay.workingDays) : '_',
            status: ele.blocked,
        }
        return item;
    });
}

export function getEmployeeInitialValue(data: any) {
    const employee = data.attributes;
    const building = employee.building.data;
    const item: EditEmployeeDetailModel = {
        profileId: data && data.id,
        firstname: employee.Firstname,
        lastname: employee.Lastname,
        role: employee.Role,
        salary: employee.Salary,
        benefit: employee.Benefit,
        maxLeave: employee.Max_Leave_Day,
        shift: employee.Shift,
        building: building ? `${building.id}-${building.attributes.Building_Name}-${building.attributes.Num_of_Floors}` : '',
        grade: employee.Grade,  
        workingDays: employee.WorkingDay ? employee.WorkingDay.workingDays : []
    }
    return item;
}

function transformWorkingDay(days: any) {
    let haveSunday = false;
    const arr = days.map((ele: string) => {
        if (ele === 'Chủ nhật') {
            haveSunday = true;
        }
        return transformDay(ele);
    }).sort().filter((ele: number) => ele !== 8);

    return `Thứ ${arr.join(', ')}${haveSunday ? `, Chủ nhật` : ''}`; 
}

function transformDay(day: string) {
    switch (day) {
        case 'Thứ hai':
            return 2;
        case 'Thứ ba':
            return 3;
        case 'Thứ tư':
            return 4;
        case 'Thứ năm':
            return 5;
        case 'Thứ sáu':
            return 6;
        case 'Thứ bảy':
            return 7;
        case 'Chủ nhật':
            return 8;
    }
}