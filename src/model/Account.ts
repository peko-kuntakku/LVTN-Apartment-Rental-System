export interface Account {
    id: number | undefined,
    username: string,
    email: string,
    jwt: string,
    role?: string,
}