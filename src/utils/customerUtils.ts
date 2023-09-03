import { CustomerListItemModel } from "../model/Customer";
import { Color } from "../styles/GlobalStyles";

export function transformCustomerListData(resData: any) {
    return resData.map((ele: any, index: number) => {
        const profile = ele.UserInfo;
        const item: CustomerListItemModel = {
            index: index + 1,
            id: ele.id,
            email: ele.email,
            username: ele.username,
            name: profile ? `${profile.Lastname} ${profile.Firstname}`: '_' ,
            profileId: profile ? profile.id : undefined,
            status: ele.blocked,
        }
        return item;
    });
}

export function getUserBlockStatusText(status: boolean | undefined) {
    if (status === false) {
        return "Có hiệu lực";
    }
    else if (status === true) {
        return "Vô hiệu hóa";
    }
    else {
        return "";
    }
}

export function getUserBlockStatusTextColor(status: boolean | undefined) {
    if (status === false) {
        return Color.success;
    } else if (status === true) {
        return Color.error;
    } else {
        return Color.extraText;
    }    
}