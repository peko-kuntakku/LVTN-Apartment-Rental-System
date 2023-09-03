import axiosClient from "./axiosClient";

const notificationApi = {
    getAll(signal: AbortSignal, jwt: string,
        page: number,
        pageSize: number,
    ) {
        let url = `/notifications?fields[0]=Title&fields[1]=Content`;
        url = url + `&pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`;
        
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },
}

export default notificationApi;