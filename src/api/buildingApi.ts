import { BuildingFormInitialValue } from "../model/Building";
import { roundCoorNumber } from "../utils/utils";
import axiosClient from "./axiosClient";

const buildingApi = {
    getAll(
        signal: AbortSignal | undefined,
        page: number,
        pageSize: number,
        searchText: string,
    ) {
        let url = `/buildings?pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`;
        url = url + '&fields[0]=Building_Name&fields[1]=Num_of_Floors&fields[2]=Province&fields[3]=District';

        if (searchText.length !== 0) {
            url = url + `&filters[Building_Name][$containsi]=${searchText}`;
        }

        return axiosClient.get(url, {
            signal
        });
    },

    getAllBuildingName() {
        const url = '/buildings?fields[0]=Building_Name&fields[1]=Num_of_Floors';
        return axiosClient.get(url);
    },

    delete(jwt: string, buildingId: number) {
        const url = `buildings/${buildingId}`;
        return axiosClient.delete(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
    },

    createBuilding(
        jwt: string,
        data: BuildingFormInitialValue
    ) {
        const url = "/buildings";

        return axiosClient.post(url,
            {
                data: {
                    Building_Name: data.buildingName,
                    Num_of_Floors: parseInt(data.numOfFloors),
                    Description: data.description,
                    District: data.district,
                    Ward: data.ward,
                    Province: data.province,
                    Address_Detail: data.addressDetail,
                    ImageURL: data.imageUrl,
                    Latitude: roundCoorNumber(parseFloat(data.latitude)),
                    Longtitude: roundCoorNumber(parseFloat(data.longtitude)),
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },

            }
        )
    },

    getBuildingDetail(buildingId: number) {
        const url = `/buildings/${buildingId}`;
        return axiosClient.get(url);
    },

    updateBuilding(
        jwt: string,
        buildingId: number,
        data: BuildingFormInitialValue
    ) {
        const url = `/buildings/${buildingId}`;        

        return axiosClient.put(url,
            {
                data: {
                    Building_Name: data.buildingName,
                    Num_of_Floors: parseInt(data.numOfFloors),
                    Description: data.description,
                    District: data.district,
                    Ward: data.ward,
                    Province: data.province,
                    Address_Detail: data.addressDetail,
                    ImageURL: data.imageUrl,
                    Latitude: roundCoorNumber(parseFloat(data.latitude)),
                    Longtitude: roundCoorNumber(parseFloat(data.longtitude)),
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },

            }
        )
    },
}

export default buildingApi;