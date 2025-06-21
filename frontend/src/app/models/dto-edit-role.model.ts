import { Permission } from './permission.model'

export interface DTOEditRole {
  roleName: string
  permissions: Permission[]
}
