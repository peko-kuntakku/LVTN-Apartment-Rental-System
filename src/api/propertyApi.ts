import { PropertyFormInitialValue } from "../model/Property";
import axiosClient from "./axiosClient";

const propertyApi = {
    getAllProperties(signal: AbortSignal, jwt: string,
        page: number,
        pageSize: number,
        searchText: string,
    ) {
        let url = '/properties?fields[0]=Property_Name&fields[1]=Price&fields[2]=Type&fields[3]=Quantity';
        url = url + `&populate[apartment]][fields][0]=Apartment_Name`;
        url = url + `&pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`

        if (searchText.length !== 0) {
            url = url + `&filters[$or][0][Property_Name][$containsi]=${searchText}`;
            url = url + `&filters[$or][1][apartment][Apartment_Name][$containsi]=${searchText}`;
        }

        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        });
    },

    getPropertyDetail(jwt: string, id: number) {
        const url = `/properties/${id}?populate[apartment][fields][0]=Apartment_Name`;
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
    },

    createProperty(
        jwt: string,
        property: PropertyFormInitialValue,
    ) {
        const url = "/properties";

        return axiosClient.post(url,
            {
                data: {
                    Property_Name: property.propertyName,
                    Price: property.price,
                    Type: parseInt(property.type),
                    Quantity: property.quantity,
                    Description: property.description,
                    apartment: parseInt(property.apartment),
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },

            }
        )
    },

    updateProperty(
        jwt: string,
        id: number,
        property: PropertyFormInitialValue
    ) {
        const url = `/properties/${id}`;
                
        return axiosClient.put(url,
            {
                data: {
                    Property_Name: property.propertyName,
                    Price: property.price,
                    Type: parseInt(property.type),
                    Quantity: property.quantity,
                    Description: property.description,
                    apartment: parseInt(property.apartment),
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
        const url = `properties/${id}`;
        return axiosClient.delete(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
    },
}

export default propertyApi;