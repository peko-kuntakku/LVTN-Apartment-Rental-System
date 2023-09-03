import { PropertyFormInitialValue, PropertyListItemModel } from "../model/Property";
import { currencyFormatter } from "./utils";

export function transformPropertyListData(resData: any) {
    return resData.map((ele: any, index: number) => {
        const apartment = ele.attributes.apartment.data;
        const item: PropertyListItemModel = {
            index: index + 1,
            id: ele.id,
            name: ele.attributes.Property_Name,
            quantity: ele.attributes.Quantity,
            price: currencyFormatter.format(ele.attributes.Price),
            type: getPropertyNameFromType(ele.attributes.Type),
            apartmentName: apartment && apartment.attributes.Apartment_Name,
            apartmentId: apartment && apartment.id,
        }
        return item;
    });
}

export function getPropertyInitialValue(data: any) {
    const apartment = data.attributes.apartment.data;
    const item: PropertyFormInitialValue = {
        propertyName: data.attributes.Property_Name,
        quantity: data.attributes.Quantity,
        price: data.attributes.Price,
        type: data.attributes.Type,
        apartment: apartment && apartment.id,
        description: data.attributes.Description,
    }
    return item;
}

export function getPropertyNameFromType(type: number) {
    if (type === 2) {
        return "Máy lạnh";
    }
    else {
        return "Khác";
    }
}


