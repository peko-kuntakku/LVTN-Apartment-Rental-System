import { ApartmentNameModel } from "../model/Apartment";
import { VoucherFormInitialValue } from "../model/Voucher";
import axiosClient from "./axiosClient";

const voucherApi = {
    /*
    get 5 fields: Start_at, Expired_at, Amount, Remained, Voucher_Name.
    used for public
    */
    getAllVouchers(signal: AbortSignal, jwt: string,
        page: number,
        pageSize: number,
        searchText: string,
    ) {
        let url = '/vouchers?fields[0]=Start_at&fields[1]=Expired_at&fields[2]=Amount&fields[3]=Remained&fields[4]=Voucher_Name'
        url = url + `&pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`

        if (searchText.length !== 0) {
            url = url + `&filters[Voucher_Name][$containsi]=${searchText}`;
        }

        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal,
        });
    },

    getVoucherDetail(jwt: string, id: number) {
        const url = `/vouchers/${id}?populate[apartments][fields][0]=Apartment_Name`;
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
    },

    createVoucher(
        jwt: string,
        voucher: VoucherFormInitialValue,
        apartments: ApartmentNameModel[],
    ) {
        const url = "/vouchers";

        return axiosClient.post(url,
            {
                data: {
                    Voucher_Name: voucher.voucherName,
                    Amount: voucher.amount,
                    Percentage: voucher.percentage,
                    Start_at: new Date(voucher.startAt!),
                    Expired_at: new Date(voucher.expiredAt!),
                    Max_Discount: voucher.maxDiscount,
                    apartments: apartments ? apartments.map(ele => ele.id) : [],
                    isApplyToAll: false,
                    Remained: voucher.amount,
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },

            }
        )
    },

    updateVoucher(
        jwt: string,
        id: number,
        voucher: VoucherFormInitialValue,
        apartments: ApartmentNameModel[],
    ) {
        const url = `/vouchers/${id}`;
                
        return axiosClient.put(url,
            {
                data: {
                    Voucher_Name: voucher.voucherName,
                    Amount: voucher.amount,
                    Percentage: voucher.percentage,
                    Start_at: new Date(voucher.startAt!),
                    Expired_at: new Date(voucher.expiredAt!),
                    Max_Discount: voucher.maxDiscount,
                    apartments: apartments ? apartments.map(ele => ele.id) : [],
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
        const url = `vouchers/${id}`;
        return axiosClient.delete(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
    },
}

export default voucherApi;