import { NotificationListItemModel } from "../model/Notification";

export function transformNotificationListData(resData: any) {
    return resData.map((ele: any, index: number) => {
        console.log(ele);
        
        const item: NotificationListItemModel = {
            index: index + 1,
            id: ele.id,
            title: ele.attributes.Title,
            content: ele.attributes.Content ? `${ele.attributes.Content.slice(0, 50)}...` : '',
        }
        return item;
    });
}