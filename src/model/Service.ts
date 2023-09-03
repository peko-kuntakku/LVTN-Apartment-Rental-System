export interface ServiceListItemModel {
    index: number,
    id: number,
    name: string,
    isCharged: string,
    type: string,
    buildingName: string,
    buildingId: number,
}

export interface ServiceFormInitialValue {
    serviceName: string,
    isCharged: boolean | undefined,
    type: number | undefined,
    building: string,
    description: string,
    price: number | undefined,
    unit: string,
}