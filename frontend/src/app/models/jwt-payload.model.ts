import { Permission } from './permission.model'

export interface JWTPayload {
  sub: number
  iat: number
  exp: number
  name: string
  permissions: Permission[]
}
