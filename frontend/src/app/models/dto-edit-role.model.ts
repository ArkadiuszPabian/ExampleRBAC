import { Permission } from './permission.model'

export interface DTOEditRole {
  id: number
  roleName: string
  permissions: Permission[]
}
