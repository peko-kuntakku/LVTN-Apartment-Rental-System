import { BuildingDetailModel, BuildingFormInitialValue, BuildingListItemModel } from "../model/Building";
import { getField } from "./utils";

export function transformBuidlingListData(resData: any) {
    return resData.map((ele: any, index: number) => {
        const item: BuildingListItemModel = {
            index: index + 1,
            id: ele.id,
            name: ele.attributes.Building_Name,
            numOfFloors: ele.attributes.Num_of_Floors,
            province: ele.attributes.Province ? getField(ele.attributes.Province)[0] : '_',
            district: ele.attributes.District,
        }
        return item;
    });
}

export function transformBuildingDetail(building: any) {
    const item: BuildingDetailModel = {
        id: building.id,
        name: building.attributes.Building_Name,
        description: building.attributes.Description,
        numberOfFloors: building.attributes.Num_of_Floors,
        province: getLocationName(building.attributes.Province),
        district: getLocationName(building.attributes.District),
        ward: getLocationName(building.attributes.Ward),
        addressDetail: building.attributes.Address_Detail,
        imageUrl: building.attributes.ImageURL,
    }
    return item;
}

function getLocationName(location: string | undefined) {
    if (!location) return '';
    const arr = location.split('-');
    return arr[0];
}

export function getBuildingInitialValue(building: any) {
    const item: BuildingFormInitialValue = {
        buildingName: building.attributes.Building_Name,
        description: building.attributes.Description,
        numOfFloors: building.attributes.Num_of_Floors,
        province: building.attributes.Province ? building.attributes.Province : '',
        district: building.attributes.District ? building.attributes.District: '',
        ward: building.attributes.Ward ? building.attributes.Ward : '',
        // province: '',
        // district: '',
        // ward: '',
        addressDetail: building.attributes.Address_Detail ? building.attributes.Address_Detail : '',
        imageUrl: building.attributes.ImageURL,
        latitude: building.attributes.Latitude ? building.attributes.Latitude : '',
        longtitude: building.attributes.Longtitude ? building.attributes.Longtitude : '',
    }
    return item;
}

export function transformBuildingNameData(resData: any) {
    return resData.map((building: any) => {
        const item: any = {
            id: building.id,
            name: building.attributes.Building_Name,
            floors: building.attributes.Num_of_Floors,
        }
        return item;
    });
}
