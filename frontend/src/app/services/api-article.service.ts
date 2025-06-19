import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DTOArticle } from '../models/dto-article.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiArticleService {
  private readonly _http = inject(HttpClient)
  private readonly _authService = inject(AuthService)

  public getArticles() {
    return this._http.get<DTOArticle[]>('/api/articles')
  }

  public deleteArticle(id: number) {
    return this._http.delete(`/api/articles/${id}`)
  }
}
