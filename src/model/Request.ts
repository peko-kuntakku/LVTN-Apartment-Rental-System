export interface RequestListItemModel {
    index: number,
    id: number,
    status: number,
    type: string,
    apartmentId: number,
    apartmentName: string,
    contractId: number,
    createdAt: string,
}

export interface RequestDetailModel {
    id: number,
    createdAtDay: number,
    createdAtMonth: number,
    createdAtYear: number,
    status: number,
    type: number,
    description: string,
    apartmentId: number,
    apartmentName: string,
    contractId: number,
    employeeFeedback: string,
    employee: HandleEmployeeModel | undefined,
}

export interface HandleEmployeeModel {
    profileId: number,
    firstname: string,
    lastname: string,
    phone: string,
    email: string,
    accountId: number,
}