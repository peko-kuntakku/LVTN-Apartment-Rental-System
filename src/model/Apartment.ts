export interface ApartmentListItemModel {
    index: number,
    id: number,
    name: string,
    size: number,
    fee: string,
    status: number,
    numOfRooms: number,
}

export interface ComplexApartmentListItemModel {
    index: number,
    id: number,
    name: string,
    totalSingleApartments: number,
    status: number,
}

export interface ApartmentFormInitialValue {
    apartmentName: string,
    size: string,
    capacity: string,
    rentalFee: string,
    buildingName: string,
    floor: string,
    livingroom: number,
    bedroom: number,
    restroom: number,
    kitchen: number,
    description: string,
    imageUrl: string,
    status: number | undefined,
    complexApartment: string | undefined,
}

export interface ComplexApartmentFormInitialValue {
    apartmentName: string,
    buildingName: string,
    floor: string,
    description: string,
    imageUrl: string,
}

export interface ApartmentNameModel {
    id: number,
    name: string,
}