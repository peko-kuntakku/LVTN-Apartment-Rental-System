import { ServiceFormInitialValue, ServiceListItemModel } from "../model/Service";

export function transformServiceListData(resData: any) {
    return resData.map((ele: any, index: number) => {
        const building = ele.attributes.building.data;
        const item: ServiceListItemModel = {
            index: index + 1,
            id: ele.id,
            name: ele.attributes.ServiceName,
            isCharged: ele.attributes.isCharged ? 'Có' : 'Không',
            type: getServiceNameFromType(ele.attributes.Type),
            buildingName: building ? building.attributes.Building_Name : '_',
            buildingId: building && building.id,
        }
        return item;
    });
}

export function getServiceInitialValue(data: any) {
    const building = data.attributes.building.data;
    const item: ServiceFormInitialValue = {
        serviceName: data.attributes.ServiceName,
        isCharged: data.attributes.isCharged,
        type: data.attributes.Type,
        building: building && building.id,
        description: data.attributes.Description,
        price: data.attributes.Price,
        unit: data.attributes.Unit ? data.attributes.Unit : '',
    }
    return item;
}

export function getServiceNameFromType(type: number) {
    if (type === 1) {
        return "Điện";
    }
    else if (type === 2) {
        return "Nước";
    }
    else if (type === 3) {
        return "Giặt ủi";
    }
    else if (type === 4) {
        return "Dọn vệ sinh";
    }
    else if (type === 5) {
        return "Sửa chữa";
    }
    else {
        return "Khác";
    }
}
