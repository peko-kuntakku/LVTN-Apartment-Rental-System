import axiosClient from "./axiosClient";

const attendanceApi = {
    getAll(signal: AbortSignal, jwt: string,
        page: number,
        pageSize: number,
    ) {
        let url = `/attendances?populate[employee][fields][0]=Firstname&populate[employee][fields][1]=Lastname`;
        url = url + `&fields[0]=Day&fields[1]=Status`;
        url = url + `&pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`;
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },
}

export default attendanceApi;