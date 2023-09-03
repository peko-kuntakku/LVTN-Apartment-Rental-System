import { CreateEmployeeDetailModel } from "../model/Employee";
import { getField } from "../utils/utils";
import axiosClient from "./axiosClient";

const employeeApi = {
    getAllEmployee(signal: AbortSignal, jwt: string,
        page: number,
        pageSize: number,
        searchText: string,
    ) {
        let url = `/users/employee/${1}`

        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            params: {
                offset: page * pageSize,
                limit: pageSize,
                filter: searchText,
            },
            signal,
        });
    },

    getEmployeeDetail(jwt: string, accountId: number, signal: AbortSignal | undefined) {
        let url = `/employees`;
        url = url + `?filters[employeeId][id][$eq]=${accountId}`
        url = url + `&populate[building][fields][0]=Building_Name&populate[building][fields][1]=Num_of_Floors`
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            signal
        });
    },

    createEmployeeDetail(
        jwt: string,
        employee: CreateEmployeeDetailModel,
        workingDays: string[],
        accountId: number,
    ) {
        const url = "/employees";

        return axiosClient.post(url,
            {
                data: {
                    Firstname: employee.firstname,
                    Lastname: employee.lastname,
                    Salary: employee.salary,
                    Max_Leave_Day: employee.maxLeave,
                    Shift: employee.shift,
                    Benefit: employee.benefit,
                    Grade: employee.grade,
                    Role: employee.role,
                    WorkingDay: { 
                        workingDays: workingDays 
                    },
                    building: parseInt(getField(employee.building)[0]),
                    employeeId: accountId,
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },

            }
        )
    },

    updateEmployeeDetail(
        jwt: string,
        employee: CreateEmployeeDetailModel,
        workingDays: string[],
        accountId: number,
        profileId: number,
    ) {
        const url = `/employees/${profileId}`;
                
        return axiosClient.put(url,
            {
                data: {
                    Firstname: employee.firstname,
                    Lastname: employee.lastname,
                    Salary: employee.salary,
                    Max_Leave_Day: employee.maxLeave,
                    Shift: employee.shift,
                    Benefit: employee.benefit,
                    Grade: employee.grade,
                    Role: employee.role,
                    WorkingDay: { 
                        workingDays: workingDays 
                    },
                    building: parseInt(getField(employee.building)[0]),
                    employeeId: accountId,
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },

            }
        )
    },

    // delete(jwt: string, id: number) {
    //     const url = `vouchers/${id}`;
    //     return axiosClient.delete(url, {
    //         headers: {
    //             Authorization: `Bearer ${jwt}`,
    //         },
    //     });
    // },
}

export default employeeApi;