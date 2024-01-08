export interface JwtData {
  userData: UserData
  iat: number
  exp: number
}

export interface UserData {
  id: string
  username: string
}
