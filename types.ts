export type TeamsResponse = {
    $id: string
    dateCreated: Date
    name: string
    total: number
}

type Status = {
    res: string
    err: string
    progress: string
}

export type User = {
    name: string
    password: string
    role: string
    username: string
}

export const initialStatusData: Status = {
    err: '',
    progress: '',
    res: ''
}