export interface BuildingListItemModel {
    index: number,
    id: number,
    name: string,
    numOfFloors: number,
    district: string,
    province: string,
}

export interface BuildingDetailModel {
    id: number,
    name: string,
    description: string,
    numberOfFloors: number,
    province: string,
    district: string,
    ward: string,
    addressDetail: string,
    imageUrl: string,
}

export interface BuildingFormInitialValue {
    buildingName: string,
    numOfFloors: string,
    description: string,
    province: string,
    district: string,
    ward: string,
    addressDetail: string,
    imageUrl: string,
    latitude: string,
    longtitude: string,
}