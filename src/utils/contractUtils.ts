import { BookingCustomer, ContractDetailModel, ContractListItemModel, UsedVoucherModel } from "../model/Contract";
import { Color } from "../styles/GlobalStyles";

export function transformContractListData(resData: any) {
    return resData.map((ele: any, index: number) => {
        const item: ContractListItemModel = {
            index: index + 1,
            id: ele.id,
            startDate: new Date(ele.attributes.Start_Date).toLocaleDateString('vi-VN'),
            expiredDate: new Date(ele.attributes.Expired_Date).toLocaleDateString('vi-VN'),
            status: ele.attributes.Status,
            customer: `${ele.attributes.customer.data.attributes.Firstname} ${ele.attributes.customer.data.attributes.Lastname}`,
            apartmentId: ele.attributes.apartment.data.id,
            apartmentName: ele.attributes.apartment.data.attributes.Apartment_Name,
        }
        return item;
    });
}

export function transformContractDetailResponseData(resData: any) {
    const apartment = resData.attributes.apartment.data;
    const item: ContractDetailModel = {
        contractId: resData.id,
        // startDate: resData.attributes.Start_Date ? new Date(resData.attributes.Start_Date).toLocaleDateString('vi-VN') : '_',
        startDate: resData.attributes.Start_Date ? resData.attributes.Start_Date : '_',
        // expiredDate: resData.attributes.Expired_Date ? new Date(resData.attributes.Expired_Date).toLocaleDateString('vi-VN') : '_',
        expiredDate: resData.attributes.Expired_Date ? resData.attributes.Expired_Date : '_',
        status: resData.attributes.Status,
        apartmentName: apartment ? apartment.attributes.Apartment_Name : '',
        rentalFee: apartment && apartment.attributes.Rent_Fee,
        apartmentId: apartment && apartment.id,
        customer: transformCustomer(resData.attributes.customer.data),
        voucher: resData.attributes.voucher.data ? transformUsedVoucher(resData.attributes.voucher.data) : undefined,
        firstMonthFee: resData.attributes.FirstMonthFee ? resData.attributes.FirstMonthFee : undefined,
    }
    return item;
}

function transformCustomer(customer: any) {
    const item: BookingCustomer = {
        id: customer.id,
        firstname: customer.attributes.Firstname,
        lastname: customer.attributes.Lastname,
        email: customer.attributes.CustomerId.data.attributes.email,
        phone: customer.attributes.Phone,
        birthday: customer.attributes.Birthday ? new Date(customer.attributes.Birthday).toLocaleDateString('vi-VN') : '_',
    }
    return item;
}

function transformUsedVoucher(data: any) {
    const item: UsedVoucherModel= {
        id: data.id,
        name: data.attributes.Voucher_Name,
        percentage: data.attributes.Percentage,
        maxDiscount: data.attributes.Max_Discount,
    }
    return item;
} 

export function getContractStatusTextColor(status: number) {
    if (status === 0 || status === 5) {
        return Color.warning;
    }
    else if (status === 1) {
        return Color.success;
    }
    else if (status === 2 || status === 4) {
        return Color.error;
    }
    else if (status === 3) {
        return Color.border;
    } 
    else {
        return Color.secondary;
    }
}

export function getContractStatus(status: number) {
    if (status === 0) {
        return "Chờ xác nhận";
    }
    else if (status === 1) {
        return "Có hiệu lực";
    }
    else if (status === 2) {
        return "Đã từ chối";
    }
    else if (status === 3) {
        return "Hết hiệu lực";
    }
    else if (status === 4) {
        return "Đã hủy";
    }
    else if (status === 5) {
        return "Chờ thanh toán";
    }
    else {
        return "";
    }
}

export function getButtonActionName(status: number) {
    if (status === 0) {
        return "Xác nhận hợp đồng";
    }
    else if (status === 5) {
        return "Kích hoạt hợp đồng";
    }
    else {
        return "";
    }
}

export function compareDateWithMonent(date: string) {
    let date1 = new Date(date);
    let moment = new Date();

    if (date1 > moment) {
        return true;
    } else {
        return false;
    }
}

export function getStatusFromAction(action: string) {
    if (action === 'xác nhận') {
        return 5;
    }
    else if (action === 'từ chối') {
        return 2;
    }
    else if (action === 'hủy') {
        return 4;
    }
    else if (action === 'kích hoạt') {
        return 1;
    }
    else {
        return '';
    }
}