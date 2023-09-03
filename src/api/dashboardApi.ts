import axiosClient from "./axiosClient";

const dashboardApi = {
    countRentedApartmentsByLocation(jwt: string, signal?: AbortSignal) {
        const url = `/buildings/count-rented-apartments-by-location`
        
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },

    countApartmentsByStatus(jwt: string, signal?: AbortSignal) {
        const url = `/apartments/count-apartments-by-status`
        
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },

    countCustomersByContract(jwt: string, signal?: AbortSignal) {
        const url = `/users/count-customers-by-contract/${1}`
        
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },

    calculateRevenueInMonth(jwt: string, signal: AbortSignal | undefined) {
        const url = `/bills/calculate-revenue-in-month`;
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },

    calculateCostInMonth(jwt: string, signal: AbortSignal | undefined) {
        const url = `/bills/calculate-cost-in-month`;
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },

    countCustomersByLastYear(jwt: string, signal?: AbortSignal) {
        const url = `/users/count-customers-by-last-year/${1}`
        
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },

    countRevenueInLastYear(jwt: string, signal?: AbortSignal) {
        const url = `/bills/calculate-revenue-in-year`;
        
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        })
    },
}

export default dashboardApi;