import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DTOArticle } from '../models/dto-article.model';
import { DTOEditArticle } from '../models/dto-edit-article.model';

@Injectable({
  providedIn: 'root'
})
export class ApiArticleService {
  private readonly _http = inject(HttpClient)

  public getArticles() {
    return this._http.get<DTOArticle[]>('/api/articles')
  }

  public createArticle(article: DTOEditArticle) {
    return this._http.post('/api/articles', article)
  }

  public updateArticle(id: number, article: DTOEditArticle) {
    return this._http.put(`/api/articles/${id}`, article)
  }

  public deleteArticle(id: number) {
    return this._http.delete(`/api/articles/${id}`)
  }
}
