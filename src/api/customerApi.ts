import axiosClient from "./axiosClient";

const customerApi = {
    getAllCustomers(signal: AbortSignal, jwt: string,
        page: number,
        pageSize: number,
        searchText: string,
    ) {
        let url = `/users/customers/${1}`

        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            params: {
                offset: page * pageSize,
                limit: pageSize,
                filter: searchText,
            },
            signal,
        });
    },

    // getEmployeeDetail(jwt: string, accountId: number, signal: AbortSignal | undefined) {
    //     let url = `/employees`;
    //     url = url + `?filters[employeeId][id][$eq]=${accountId}`
    //     url = url + `&populate[building][fields][0]=Building_Name&populate[building][fields][1]=Num_of_Floors`
    //     return axiosClient.get(url, {
    //         headers: {
    //             Authorization: `Bearer ${jwt}`,
    //         },
    //         signal
    //     });
    // },
}

export default customerApi;