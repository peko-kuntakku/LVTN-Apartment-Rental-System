import { ServiceFormInitialValue } from "../model/Service";
import axiosClient from "./axiosClient";

const serviceApi = {
    getAllServices(signal: AbortSignal, jwt: string,
        page: number,
        pageSize: number,
        searchText: string,
    ) {
        let url = '/services?fields[0]=ServiceName&fields[1]=isCharged&fields[2]=Type';
        url = url + `&populate[building][fields][0]=Building_Name`;
        url = url + `&pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`

        if (searchText.length !== 0) {
            url = url + `&filters[$or][0][ServiceName][$containsi]=${searchText}`;
            url = url + `&filters[$or][1][building][Building_Name][$containsi]=${searchText}`;
        }

        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        });
    },

    getServiceDetail(jwt: string, id: number) {
        const url = `/services/${id}?populate[building][fields][0]=Building_Name`;
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
    },

    createService(
        jwt: string,
        service: ServiceFormInitialValue,
    ) {
        const url = "/services";

        return axiosClient.post(url,
            {
                data: {
                    ServiceName: service.serviceName,
                    Description: service.description,
                    Price: service.price,
                    Unit: service.unit,
                    isCharged: service.isCharged,
                    Type: service.type,
                    building: parseInt(service.building),
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },

            }
        )
    },

    updateService(
        jwt: string,
        id: number,
        service: ServiceFormInitialValue
    ) {
        const url = `/services/${id}`;
                
        return axiosClient.put(url,
            {
                data: {
                    ServiceName: service.serviceName,
                    Description: service.description,
                    Price: service.price,
                    Unit: service.unit,
                    isCharged: service.isCharged,
                    Type: service.type,
                    building: parseInt(service.building),
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },

            }
        )
    },

    delete(jwt: string, id: number) {
        const url = `services/${id}`;
        return axiosClient.delete(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
    },
}

export default serviceApi;