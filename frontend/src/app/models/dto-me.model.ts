import { Permission } from './permission.model'

export class DtoMeModel {
  id!: number
  name!: string
  permissions!: Permission[]
}
