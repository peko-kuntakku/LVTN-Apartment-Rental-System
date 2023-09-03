import { VoucherFormInitialValue, VoucherListItemModel } from "../model/Voucher";
import { transformApartmentNameData } from "./apartmentUtils";

export function transformVoucherListData(resData: any) {
    return resData.map((ele: any, index: number) => {
        const item: VoucherListItemModel = {
            index: index + 1,
            id: ele.id,
            name: ele.attributes.Voucher_Name,
            startAt: new Date(ele.attributes.Start_at).toLocaleString('vi-VN'),
            expiredAt: new Date(ele.attributes.Expired_at).toLocaleString('vi-VN'),
            amount: ele.attributes.Amount,
            remained: ele.attributes.Remained ? ele.attributes.Remained : '_',
        }
        return item;
    });
}

export function getVoucherInitialValue(data: any) {
    const apartments = data.attributes.apartments.data;
    const item: VoucherFormInitialValue = {
        voucherName: data.attributes.Voucher_Name,
        startAt: data.attributes.Start_at,
        expiredAt: data.attributes.Expired_at,
        amount: data.attributes.Amount,
        percentage: data.attributes.Percentage ? data.attributes.Percentage : undefined,
        maxDiscount: data.attributes.Max_Discount,
        apartments: transformApartmentNameData(apartments),
    }
    return item;
}