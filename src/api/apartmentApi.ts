import { ApartmentFormInitialValue, ComplexApartmentFormInitialValue } from "../model/Apartment";
import { getField } from "../utils/utils";
import axiosClient from "./axiosClient";

const getAllSingleUrl =
    '/apartments?fields[0]=Apartment_Name&fields[1]=Size&fields[2]=Rent_Fee&fields[3]=Status&fields[4]=Livingroom&fields[5]=Bedroom&fields[6]=Restroom&fields[7]=Kitchen';
const getAllComplexUrl = 
    '/apartments?fields[0]=Apartment_Name&fields[1]=Status&populate[apartments][fields][0]=Status&populate[apartments][fields][1]=Rent_Fee';

const apartmentApi = {
    getAllApartmentByType(
        signal: AbortSignal | undefined,
        isSingle: boolean,
        page: number,
        pageSize: number,
        searchText: string,
        buildingId?: number,
        complexApartmentId?: number,
    ) {
        let url = ``;
        if (isSingle) {
            url = url + `${getAllSingleUrl}&filters[isSingle][$eq]=${isSingle}`
        } else {
            url = url + `${getAllComplexUrl}&filters[isSingle][$eq]=${isSingle}`
        }
        url = url + `&pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`

        if (searchText.length !== 0) {
            url = url + `&filters[Apartment_Name][$containsi]=${searchText}`;
        }

        if (buildingId) {
            url = url + `&filters[building][id][$eq]=${buildingId}`;
        }

        if (complexApartmentId) {
            url = url + `&filters[containApartment][id][$eq]=${complexApartmentId}`;
        }

        return axiosClient.get(url, {
            signal
        });
    },

    getApartmentDetail(jwt: string, id: number) {
        let url = `/apartments/${id}?populate[building][fields][0]=Building_Name&populate[building][fields][1]=Num_of_Floors`;
        url = url + `&populate[containApartment][fields][0]=Apartment_Name&populate[containApartment][fields][1]=Floor`
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
    },

    createApartment(
        jwt: string,
        apartment: ApartmentFormInitialValue
    ) {
        const url = "/apartments";

        return axiosClient.post(url,
            {
                data: {
                    Apartment_Name: apartment.apartmentName,
                    Floor: parseInt(apartment.floor),
                    Status: 0,
                    Capacity: parseInt(apartment.capacity),
                    Rent_Fee: parseInt(apartment.rentalFee),
                    Size: parseFloat(apartment.size),
                    isSingle: true,
                    Livingroom: apartment.livingroom,
                    Bedroom: apartment.bedroom,
                    Restroom: apartment.restroom,
                    Kitchen: apartment.kitchen,
                    Description: apartment.description,
                    building: parseInt(getField(apartment.buildingName)[0]),
                    ImageURL: apartment.imageUrl,
                    containApartment: apartment.complexApartment && parseInt(getField(apartment.complexApartment)[0]),
                    isDependent: apartment.complexApartment ? true : false,
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },

            }
        )
    },

    createComplexApartment(
        jwt: string,
        apartment: ComplexApartmentFormInitialValue
    ) {
        const url = "/apartments";

        return axiosClient.post(url,
            {
                data: {
                    Apartment_Name: apartment.apartmentName,
                    Floor: parseInt(apartment.floor),
                    Status: 2,
                    isSingle: false,
                    Description: apartment.description,
                    building: parseInt(getField(apartment.buildingName)[0]),
                    ImageURL: apartment.imageUrl,
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },

            }
        )
    },

    updateApartment(
        jwt: string,
        id: number,
        apartment: ApartmentFormInitialValue
    ) {
        const url = `/apartments/${id}`;        

        return axiosClient.put(url,
            {
                data: {
                    Apartment_Name: apartment.apartmentName,
                    Floor: parseInt(apartment.floor),
                    Status: 0,
                    Capacity: parseInt(apartment.capacity),
                    Rent_Fee: parseInt(apartment.rentalFee),
                    Size: parseFloat(apartment.size),
                    isSingle: true,
                    Livingroom: apartment.livingroom,
                    Bedroom: apartment.bedroom,
                    Restroom: apartment.restroom,
                    Kitchen: apartment.kitchen,
                    Description: apartment.description,
                    building: parseInt(getField(apartment.buildingName)[0]),
                    ImageURL: apartment.imageUrl,
                    containApartment: apartment.complexApartment ? parseInt(getField(apartment.complexApartment)[0]) : null,
                    isDependent: apartment.complexApartment ? true : false,
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },

            }
        )
    },

    updateComplexApartment(
        jwt: string,
        id: number,
        apartment: ComplexApartmentFormInitialValue
    ) {
        const url = `/apartments/${id}`;

        return axiosClient.put(url,
            {
                data: {
                    Apartment_Name: apartment.apartmentName,
                    Floor: parseInt(apartment.floor),
                    Status: 0,
                    isSingle: false,
                    Description: apartment.description,
                    building: parseInt(getField(apartment.buildingName)[0]),
                    ImageURL: apartment.imageUrl,
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
        const url = `apartments/${id}`;
        return axiosClient.delete(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
    },

    getAllSingleApartmentName(signal: AbortSignal | undefined) {
        let url = `/apartments?fields[0]=Apartment_Name&filters[isSingle][$eq]=true`;
        // if (voucherId) {
        //     url = url + `&filters[vouchers][id][$ne]=${voucherId}`
        // }
        return axiosClient.get(url, {
            signal,
        });
    },

    getAllComplexApartmentName(signal: AbortSignal | undefined) {
        let url = `/apartments?fields[0]=Apartment_Name&fields[1]=Floor&filters[isSingle][$eq]=false`;
        url = url + `&populate[building][fields][0]=Building_Name&populate[building][fields][1]=Num_of_Floors`;
        
        return axiosClient.get(url, {
            signal,
        });
    },
}

export default apartmentApi;