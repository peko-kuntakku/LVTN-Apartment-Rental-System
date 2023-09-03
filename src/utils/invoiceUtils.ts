import { InvoiceDetailModel, InvoiceListItemModel } from "../model/Invoice";
import { Color } from "../styles/GlobalStyles";
import { currencyFormatter } from "./utils";

export function transformInvoiceListData(resData: any) {
    return resData.map((ele: any, index: number) => {
        const type = ele.attributes.Type;
        const item: InvoiceListItemModel = {
            index: index + 1,
            id: ele.id,
            startDate: ele.attributes.Start_Date ? new Date(ele.attributes.Start_Date).toLocaleDateString('vi-VN') : '_',
            dueDate: ele.attributes.Due_Date && new Date(ele.attributes.Due_Date).toLocaleDateString('vi-VN'),
            status: ele.attributes.Status,
            apartmentId: type===1 ? ele.attributes.contract.data.attributes.apartment.data.id : '',
            apartmentName: type===1 ? ele.attributes.contract.data.attributes.apartment.data.attributes.Apartment_Name : '_',
            total: currencyFormatter.format(ele.attributes.Total_Payment),
            billType: ele.attributes.Bill_Type,
            type: type === 1 ? 'Hoá đơn thu' : 'Hoá đơn chi',
        }
        return item;
    });
}

export function transformInvoiceDetailResponseData(resData: any) {
    const status = resData.attributes.Status;
    const type = resData.attributes.Type;
    const item: InvoiceDetailModel = {
        id: resData.id,
        startDate: resData.attributes.Start_Date ? new Date(resData.attributes.Start_Date).toLocaleDateString('vi-VN') : '_',
        dueDate: resData.attributes.Due_Date ? new Date(resData.attributes.Due_Date).toLocaleDateString('vi-VN') : '_',
        status: resData.attributes.Status,
        apartmentName: type===1 ? resData.attributes.contract.data.attributes.apartment.data.attributes.Apartment_Name : '_',
        total: resData.attributes.Total_Payment,
        billType: resData.attributes.Bill_Type,
        type: resData.attributes.Type,
        apartmentId: type===1 ? resData.attributes.contract.data.attributes.apartment.data.id : '',
    }
    return item;
}

export function getInvoiceType(type: number) {
    if (type === 1) {
        return "Hóa đơn tiền cọc";
    } else if (type === 2) {
        return "Hóa đơn tiền thuê";
    } else if (type === 3) {
        return "Hóa đơn dịch vụ";
    } else if (type === 4) {
        return 'Hóa đơn khác';
    } else {
        return "";
    }
}

export function getInvoiceGroup(type: number) {
    if (type === 1) {
        return "Thu";
    } else if (type === 2) {
        return "Chi";
    } else {
        return "";
    }
}

export function getInvoiceStatusText(status: number) {
    if (status === 0) {
        return "Chờ thanh toán";
    } else if (status === 1) {
        return "Chờ xác nhận";
    } else if (status === 2) {
        return "Đã thanh toán";
    } else if (status === 3) {
        return "Đã hủy";
    }
    else {
        return "";
    }
}

export function getInvoiceStatusTextColor(status: number) {
    if (status === 0) {
        return Color.warning;
    } else if (status === 1) {
        return Color.warning;
    } else if (status === 2) {
        return Color.success;
    } else if (status === 3) {
        return Color.error;
    }
    else {
        return "";
    }
}

export function getDashboardRevenueLabel(type: number) {
    if (type === 1) {
        return "Tiền cọc phòng";
    } else if (type === 2) {
        return "Tiền thuê phòng";
    } else if (type === 3) {
        return "Tiền dịch vụ";
    } else if (type === 4) {
        return 'Khác';
    } else {
        return "";
    }
}