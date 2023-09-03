export interface PropertyListItemModel {
    index: number,
    id: number,
    name: string,
    quantity: number,
    price: string,
    type: string,
    apartmentName: string,
    apartmentId: number,
}

export interface PropertyFormInitialValue {
    propertyName: string,
    quantity: number,
    price: number | undefined,
    type: string,
    apartment: string,
    description: string,
}