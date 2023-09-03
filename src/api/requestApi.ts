import axiosClient from "./axiosClient";

const requestApi = {
    getAllRequest(signal: AbortSignal, jwt: string,
        page: number,
        pageSize: number,
    ) {
        let url = `/service-requests?populate[contract][fields][0]=id&populate[contract][populate][apartment][fields][0]=Apartment_Name`;
        url = url + `&pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`;
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },

    getRequestDetail(jwt: string, requestId: number, signal: AbortSignal | undefined) {
        let url = `/service-requests/${requestId}`;
        url = url + `?populate[contract][fields][0]=id&populate[contract][populate][apartment][fields][0]=Apartment_Name`;
        url = url + `&populate[employee][fields][0]=Firstname&populate[employee][fields][1]=Lastname&populate[employee][fields][2]=Phone`;
        url = url + `&populate[employee][populate][employeeId][fields][0]=email`;

        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },

}

export default requestApi;