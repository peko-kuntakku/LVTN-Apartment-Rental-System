import { HandleEmployeeModel, RequestDetailModel, RequestListItemModel } from "../model/Request";
import { Color } from "../styles/GlobalStyles";

export function transformRequestListData(resData: any) {
    return resData.map((ele: any, index: number) => {
        const item: RequestListItemModel = {
            index: index + 1,
            id: ele.id,
            status: ele.attributes.Status,
            apartmentId: ele.attributes.contract.data.attributes.apartment.data.id,
            apartmentName: ele.attributes.contract.data.attributes.apartment.data.attributes.Apartment_Name,
            contractId: ele.attributes.contract.id,
            type: ele.attributes.Request_Type ? getRequestTypeText(ele.attributes.Request_Type) : '_',
            createdAt: ele.attributes.createdAt ? new Date(ele.attributes.createdAt).toLocaleDateString('vi-VN') : '_'
        }
        return item;
    });
}

export function transformRequestDetailResponseData(request: any) {
    const dayCreated = new Date(request.attributes.createdAt);
    const apartment = request.attributes.contract.data.attributes.apartment.data;
    const item: RequestDetailModel = {
        id: request.id,
        createdAtDay: dayCreated.getDate(),
        createdAtMonth: dayCreated.getMonth() + 1,
        createdAtYear: dayCreated.getFullYear(),
        status: request.attributes.Status,
        type: request.attributes.Request_Type,
        description: request.attributes.Description,
        apartmentId: apartment.id,
        apartmentName: apartment.attributes.Apartment_Name,
        contractId: request.attributes.contract.data.id,
        employeeFeedback: request.attributes.EmployeeFeedback ? request.attributes.EmployeeFeedback : '',
        employee: request.attributes.employee.data ? transformHandleEmployeeData(request.attributes.employee.data) : undefined,
    }
    return item;
}

function transformHandleEmployeeData(ele: any) {
    const account = ele.attributes.employeeId.data;
    const item: HandleEmployeeModel = {
        profileId: ele.id,
        firstname: ele.attributes.Firstname,
        lastname: ele.attributes.Lastname,
        phone: ele.attributes.Phone ? ele.attributes.Phone : '_',
        accountId: account.id,
        email: account.attributes.email,
    }
    return item;
}

export function getRequestStatusText(status: number) {
    if (status === 0) {
        return "Chờ xử lý";
    } else if (status === 1) {
        return "Đang xử lý";
    } else if (status === 2) {
        return "Chờ xác nhận";
    } else if (status === 3) {
        return "Đã hủy";
    } else if (status === 4) {
        return "Hoàn thành";
    }
    else {
        return "";
    }
}

export function getRequestStatusTextColor(status: number) {
    if (status === 0 || status === 1 || status === 2) {
        return Color.warning;
    } else if (status === 3) {
        return Color.error;
    } else if (status === 4) {
        return Color.success;
    } else {
        return Color.secondary;
    }
}

export function getRequestTypeText(type: number) {
    if (type === 3) {
        return "Giặt ủi";
    } else if (type === 4) {
        return "Dọn vệ sinh";
    } else if (type === 5) {
        return "Sửa chữa";
    } else if (type === 6) {
        return "Khác"
    } else {
        return "";
    }
}

export function getRequestTypeColor(type: number) {
    if (type === 3 || type === 4 || type === 5) {
        return Color.success;
    } else if (type === 6) {
        return Color.warning;
    } else {
        return Color.secondary;
    }
}
