import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { DTOArticle } from '../models/dto-article.model'
import { DTOEditArticle } from '../models/dto-edit-article.model'

@Injectable({
  providedIn: 'root',
})
export class ApiArticleService {
  private readonly _http = inject(HttpClient)

  public getSingleArticle(id: number) {
    return this._http.get<DTOEditArticle>(
      `${environment.apiUrl}/articles/${id}`
    )
  }

  public getArticles() {
    return this._http.get<DTOArticle[]>(`${environment.apiUrl}/articles`)
  }

  public createArticle(article: DTOEditArticle) {
    return this._http.post(`${environment.apiUrl}/articles`, article)
  }

  public updateArticle(id: number, article: DTOEditArticle) {
    return this._http.put(`${environment.apiUrl}/articles/${id}`, article)
  }

  public deleteArticle(id: number) {
    return this._http.delete(`${environment.apiUrl}/articles/${id}`)
  }
}
