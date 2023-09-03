import axios from "axios";
import axiosClient from "./axiosClient";

const BASE_URL = 'https://provinces.open-api.vn/api';

const locationApi = {
    getAllProvinces(signal: AbortSignal | undefined) {
        const url = `${BASE_URL}/p/`;
        return axios.get(url, {
            signal
        });
    },
    getDistricts(provinceCode: number) {
        const url = `${BASE_URL}/p/${provinceCode}?depth=2`;
        return axios.get(url);
    },
    getWards(districtCode: number) {
        const url = `${BASE_URL}/d/${districtCode}?depth=2`;
        return axios.get(url);
    },

    // createLocation(
    //     jwt: string,
    //     province: string,
    //     district: string,
    //     ward: string,
    //     detail: string,
    // ) {
    //     const url = "/locations";

    //     return axiosClient.post(url,
    //         {
    //             data: {
    //                 District: district,
    //                 Ward: ward,
    //                 Province: province,
    //                 Address_Detail: detail,
    //             }
    //         },
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${jwt}`,
    //             },

    //         }
    //     )
    // }
}

export default locationApi;