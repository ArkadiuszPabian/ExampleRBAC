import { HttpContext } from '@angular/common/http'
import { SKIP_AUTH } from './auth-context-token'

export function skipAuth() {
  return {
    context: new HttpContext().set(SKIP_AUTH, true),
  }
}
