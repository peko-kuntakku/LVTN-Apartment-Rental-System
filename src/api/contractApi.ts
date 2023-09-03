import axiosClient from "./axiosClient";

const contractApi = {
    getAllContractByStatus(signal: AbortSignal, jwt: string) {
        // if (status === 0) {
        //     url = `/contracts?populate[apartment][fields][0]=Apartment_Name&filters[customer][id][$eq]=${profileId}&filters[Status][$in][0]=0&filters[Status][$in][1]=5`
        // } else {
        //     url = `/contracts?populate[apartment][fields][0]=Apartment_Name&filters[customer][id][$eq]=${profileId}&filters[Status][$eq]=${status}`
        // }
        let url = `/contracts?populate[apartment][fields][0]=Apartment_Name&fields[0]=Start_Date&fields[1]=Expired_Date&fields[2]=Status`;
        url = url + `&populate[customer][fields][0]=Firstname&populate[customer][fields][1]=Lastname`
        url = url + `&sort[0]=id%3Adesc`
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },

    countUserContract(jwt: string, profileId: number, signal?: AbortSignal) {
        const url = `/contracts/count-user-contract/${profileId}`
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },

    getContractDetail(jwt: string, contractId: number, signal: AbortSignal | undefined) {
        let url = `/contracts/${contractId}`;
        url = url + `?populate[customer][fields][0]=Firstname&populate[customer][fields][1]=Lastname&populate[customer][fields][2]=Phone&populate[customer][fields][3]=Birthday`
        url = url + `&populate[customer][populate][CustomerId][fields][0]=email`
        url = url + `&populate[apartment][fields][0]=Apartment_Name&populate[apartment][fields][1]=Rent_Fee`;
        url = url + `&populate[voucher][fields][0]=Voucher_Name&populate[voucher][fields][1]=Percentage&populate[voucher][fields][2]=Max_Discount`;

        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },

    updateContractStatus(
        jwt: string, 
        contractId: number, 
        status: number, 
        declinedText: string, 
        action: string,
        apartmentId: number,
    ) {
        const url =  `/contracts/${contractId}`;
        const data = {
            Status: status,
            Declined_reason: declinedText,
            apartment: apartmentId,
        };
    
        return axiosClient.put(url,
            {
                data: data
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                }
            },
        );
    },
}

export default contractApi;