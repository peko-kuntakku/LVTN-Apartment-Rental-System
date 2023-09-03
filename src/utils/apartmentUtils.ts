import { ApartmentFormInitialValue, ApartmentListItemModel, ApartmentNameModel, ComplexApartmentFormInitialValue, ComplexApartmentListItemModel } from "../model/Apartment";
import { Color } from "../styles/GlobalStyles";
import { currencyFormatter } from "./utils";

export function transformApartmentListData(resData: any) {
    return resData.map((ele: any, index: number) => {
        const item: ApartmentListItemModel = {
            index: index + 1,
            id: ele.id,
            name: ele.attributes.Apartment_Name,
            size: ele.attributes.Size,
            fee: currencyFormatter.format(ele.attributes.Rent_Fee),
            status: ele.attributes.Status,
            numOfRooms: ele.attributes.Livingroom + ele.attributes.Bedroom + ele.attributes.Restroom + ele.attributes.Kitchen,
        }
        return item;
    });
}

export function transformComplexApartmentListData(resData: any) {
    return resData.map((ele: any, index: number) => {
        let apartments: any[] = ele.attributes.apartments.data;
        let emptyApartments = apartments.filter(ele => ele.attributes.Status === 0);

        const item: ComplexApartmentListItemModel = {
            index: index + 1,
            id: ele.id,
            name: ele.attributes.Apartment_Name,
            totalSingleApartments: apartments.length,
            status: apartments.length !== 0 ? (emptyApartments.length !== 0 ? 1 : 2) : 1,
        }
        return item;
    });
}

export function getApartmentInitialValue(data: any) {
    const building = data.attributes.building.data;
    const complex = data.attributes.containApartment?.data;
    const item: ApartmentFormInitialValue = {
        apartmentName: data.attributes.Apartment_Name,
        size: data.attributes.Size,
        capacity: data.attributes.Capacity,
        rentalFee: data.attributes.Rent_Fee,
        buildingName: `${building.id}-${building.attributes.Building_Name}-${building.attributes.Num_of_Floors}`,
        floor: data.attributes.Floor,
        livingroom: data.attributes.Livingroom,
        bedroom: data.attributes.Bedroom,
        restroom: data.attributes.Restroom,
        kitchen: data.attributes.Kitchen,
        description: data.attributes.Description ? data.attributes.Description : '',
        imageUrl: data.attributes.ImageURL,
        status: data.attributes.Status,
        complexApartment: 
            complex ? `${complex.id}-${complex.attributes.Apartment_Name}-${complex.attributes.Floor}-${building.id}-${building.attributes.Building_Name}-${building.attributes.Num_of_Floors}` : '',
    }
    return item;
}

export function getComplexApartmentInitialValue(data: any) {
    const building = data.attributes.building.data;
    const item: ComplexApartmentFormInitialValue = {
        apartmentName: data.attributes.Apartment_Name,
        buildingName: `${building.id}-${building.attributes.Building_Name}-${building.attributes.Num_of_Floors}`,
        floor: data.attributes.Floor,
        description: data.attributes.Description ? data.attributes.Description : '',
        imageUrl: data.attributes.ImageURL,
    }
    return item;
}

export function transformApartmentNameData(resData: any) {
    return resData.map((ele: any) => {
        const item: ApartmentNameModel = {
            id: ele.id,
            name: ele.attributes.Apartment_Name,
        }
        return item;
    });
}

export function transformComplexApartmentNameData(resData: any) {
    return resData.map((ele: any) => {
        const item: any = {
            id: ele.id,
            name: ele.attributes.Apartment_Name,
            floor: ele.attributes.Floor,
            buildingId: ele.attributes.building.data.id,
            buildingName: ele.attributes.building.data.attributes.Building_Name,
            buildingFloors: ele.attributes.building.data.attributes.Num_of_Floors
        }
        return item;
    });
}

export function getApartmentStatus(status: number | undefined) {
    if (status === 0) {
        return "Trống";
    }
    else if (status === 1) {
        return "Còn chỗ";
    }
    else if (status === 2) {
        return "Hết chỗ";
    }
    else {
        return "";
    }
}

export function getStatusTextColor(status: number | undefined) {
    if (status === 0) {
        return Color.success;
    }
    else if (status === 1) {
        return Color.warning;
    }
    else if (status === 2) {
        return Color.error;
    }
    else {
        return Color.secondary;
    }
}