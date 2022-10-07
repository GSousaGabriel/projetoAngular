export interface IUsuario {
    id: number;
    password: string
    is_superuser: boolean
    username: string
    first_name: string
    last_name: string
    email: string
    is_staff: boolean
    is_active: boolean
}

export interface ILogin {
    username: string
    password: string
}

