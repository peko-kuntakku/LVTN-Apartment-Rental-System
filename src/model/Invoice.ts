export interface InvoiceListItemModel {
    index: number,
    id: number,
    apartmentName: string,
    apartmentId: number,
    type: string,
    billType: number,
    startDate: string,
    dueDate: string,
    total: string,
    status: number,
}

export interface InvoiceDetailModel {
    id: number,
    startDate: string,
    dueDate: string,
    status: number,
    apartmentName: string,
    total: number,
    apartmentId: number,
    billType: number,
    type: number,
}

export interface InvoiceFormOneInitialValue {
    billType: string,
    startAt: Date,
    expiredAt: Date,
    fee: number | undefined,
    description: string,
}

export interface InvoiceFormTwoInitialValue {
    paidAt: Date,
    fee: number | undefined,
    description: string,
}