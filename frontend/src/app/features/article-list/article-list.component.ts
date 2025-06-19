import { NgFor } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { DTOArticle } from '../../models/dto-article.model';
import { ApiArticleService } from '../../services/api-article.service';

@Component({
  selector: 'app-article-list',
  imports: [
    HasPermissionDirective,
    NgFor
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss'
})
export class ArticleListComponent implements OnInit, OnDestroy {
  private _apiArticleService = inject(ApiArticleService)
  private readonly destroy$ = new Subject<void>();
  private readonly reloadTrigger$ = new Subject<void>();

  public articles: DTOArticle[] = []

  ngOnInit(): void {
    this.reloadTrigger$
      .pipe(
        switchMap(() => this.loadArticles()),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (articles) => (this.articles = articles),
      });
    this.reloadTrigger$.next();
  }

  public loadArticles() {
    return this._apiArticleService.getArticles()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
