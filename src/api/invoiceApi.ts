import { InvoiceFormOneInitialValue, InvoiceFormTwoInitialValue } from "../model/Invoice";
import axiosClient from "./axiosClient";

const invoiceApi = {
    getAllInvoiceByStatus(signal: AbortSignal, jwt: string) {
        /*
        GET BILLS WITH CONTRACT STATUS 1 (VALID) OR 5 (WAITING FOR DEPOSIT)
        */
        const url = `/bills?populate[contract][fields][0]=id&populate[contract][populate][apartment][fields][0]=Apartment_Name`;

        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },

    getInvoiceDetail(jwt: string, invoiceId: number, signal: AbortSignal | undefined) {
        let url = `/bills/${invoiceId}`;
        url = url + `?populate[contract][fields][0]=id&populate[contract][populate][apartment][fields][0]=Apartment_Name`;
        url = url + `&populate[service_request][fields][0]=id&populate[service_request][populate][contract][populate][apartment][fields][0]=Apartment_Name`;
        url = url + `&populate[service_request][populate][contract][fields][0]=id`;

        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },

    updateInvoiceStatus(jwt: string, invoiceId: number, status: number) {
        const url = `/bills/${invoiceId}`;
        return axiosClient.put(url,
            {
                data: {
                    Status: status,
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                }
            },
        );
    },

    // TẠO HÓA ĐƠN THU
    createInvoiceType1(jwt: string, data: InvoiceFormOneInitialValue, contractId: number, requestId: number | undefined) {
        const url = `/bills`;

        return axiosClient.post(url,
            {
                data: {
                    Bill_Type: parseInt(data.billType),
                    Total_Payment: data.fee,
                    Due_Date: new Date(data.expiredAt),
                    Start_Date: new Date(data.startAt),
                    Status: 0,
                    Description: data.description,
                    Type: 1,
                    contract: contractId,
                    service_request: requestId ? requestId : null,
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                }
            },
        )
    },

    // TẠO HÓA ĐƠN CHI
    createInvoiceType2(jwt: string, data: InvoiceFormTwoInitialValue) {
        const url = `/bills`;

        return axiosClient.post(url,
            {
                data: {
                    Bill_Type: 4,
                    Total_Payment: data.fee,
                    Due_Date: new Date(data.paidAt),
                    Status: 2,
                    Description: data.description,
                    Type: 2,
                    publishedAt: new Date(data.paidAt),
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                }
            },
        )
    }
}

export default invoiceApi;