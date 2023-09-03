import { EmployeeAccountModel } from "../model/Employee";
import axiosClient from "./axiosClient";

const authApi = {
    login(identifier: string, password: string) {
        const url = '/auth/local';
        return axiosClient.post(url, {
            identifier,
            password,
        })
    },

    registerEmployee(employee: EmployeeAccountModel) {
        const url = '/auth/local/register';
        return axiosClient.post(url, {
            username: employee.username,
            email: employee.email,
            password: employee.password,
            registerEmployee: true, 
        })
    },

    updateUserBlockStatus(
        jwt: string,
        accountId: number,
        isBlocked: boolean,
    ) {
        const url = `/users/${accountId}`;
        
        return axiosClient.put(url,
            {
                blocked: !isBlocked,
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },

            }
        )
    },
};

export default authApi;