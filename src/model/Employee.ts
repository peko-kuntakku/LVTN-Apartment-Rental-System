export interface EmployeeListItemModel {
    index: number,
    id: number,
    email: string,
    profileId: number,
    name: string,
    role: string,
    workingDays: string,
    salary: string,
    shift: string,
    status: boolean,
}

export interface EmployeeAccountModel {
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
}

export interface CreateEmployeeDetailModel {
    firstname: string,
    lastname: string,
    role: string,
    salary: number,
    benefit: number,
    maxLeave: number,
    shift: string,
    building: string,
    grade: string,
}

export interface EditEmployeeDetailModel extends CreateEmployeeDetailModel {
    profileId: number,
    workingDays: string[],
}