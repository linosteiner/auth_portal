export interface UserRegisterDTO {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  roles: string[]
}