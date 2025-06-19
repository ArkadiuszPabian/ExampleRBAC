import { NgFor } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ConfirmModalComponent } from '../../core/modals/confirm-modal/confirm-modal.component';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { DTOArticle } from '../../models/dto-article.model';
import { ApiArticleService } from '../../services/api-article.service';
import { ModalService } from '../../services/modal.service';

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
  private readonly _apiArticleService = inject(ApiArticleService)
  private readonly _modalService = inject(ModalService)
  private readonly destroy$ = new Subject<void>();
  private readonly reloadTrigger$ = new Subject<void>();

  public articles: DTOArticle[] = []

  ngOnInit(): void {
    this.reloadTrigger$
      .pipe(
        switchMap(() => this.loadArticles()),
        catchError((_err) => of([])),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (articles) => {
          console.debug({articles})
          this.articles = articles
        },
      });
    this.reloadTrigger$.next();
  }

  public loadArticles() {
    return this._apiArticleService.getArticles()
  }

  public deleteArticle(id: number) {
    this._modalService.open(ConfirmModalComponent, {
      title: 'Are you sure you want to remove the article?'
    }).instance.result.pipe(
      switchMap((result) => {
        if (result === true) {
          return this._apiArticleService.deleteArticle(id)
        }
        return of(undefined)
      })
    )
    .subscribe({
      error: () => {
        this._modalService.close()
      },
      next: () => {
        this.reloadTrigger$.next()
        this._modalService.close()
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
