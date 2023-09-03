import { ApartmentNameModel } from "./Apartment";

export interface VoucherListItemModel {
    index: number,
    id: number,
    name: string,
    startAt: string,
    expiredAt: string,
    amount: number,
    remained: number
}

export interface VoucherFormInitialValue {
    voucherName: string,
    startAt: Date | undefined,
    expiredAt: Date | undefined,
    amount: number | undefined,
    percentage: number | undefined,
    maxDiscount: number | undefined,
    apartments: ApartmentNameModel[],
}