export interface ContractListItemModel {
    index: number,
    id: number,
    apartmentName: string,
    apartmentId: number,
    startDate: string,
    expiredDate: string,
    customer: string,
    status: number,
}

export interface ContractDetailModel {
    contractId: number,
    startDate: string,
    expiredDate: string,
    status: number,
    apartmentName: string,
    rentalFee: number,
    apartmentId: number,
    customer: BookingCustomer,
    voucher: UsedVoucherModel | undefined,
    firstMonthFee: number,
}

export interface UsedVoucherModel {
    id: number,
    name: string,
    percentage: number,
    maxDiscount: number,
}

export interface BookingCustomer {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    birthday: string,
}