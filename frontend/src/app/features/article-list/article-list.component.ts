import { NgFor, NgIf } from '@angular/common'
import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs'
import { ArticleEditorModalComponent } from '../../core/modals/article-editor-modal/article-editor-modal.component'
import { ConfirmModalComponent } from '../../core/modals/confirm-modal/confirm-modal.component'
import { HasPermissionDirective } from '../../directives/has-permission.directive'
import { DTOArticle } from '../../models/dto-article.model'
import { ApiArticleService } from '../../services/api-article.service'
import { ModalService } from '../../services/modal.service'

@Component({
  selector: 'app-article-list',
  imports: [
    HasPermissionDirective,
    NgFor,
    NgIf,
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit, OnDestroy {
  private readonly _apiArticleService = inject(ApiArticleService)
  private readonly _modalService = inject(ModalService)
  private readonly destroy$ = new Subject<void>()
  private readonly reloadTrigger$ = new Subject<void>()

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
          this.articles = articles
        },
      })
    this.reloadTrigger$.next()
  }

  public loadArticles() {
    return this._apiArticleService.getArticles()
  }

  public editArticle(id: number) {
    this._modalService.runModal(
      ArticleEditorModalComponent,
      'update:articles',
      { id },
      (result) => this._apiArticleService.updateArticle(id, result),
      this.reloadTrigger$
    )
  }

  public createNewArticle() {
    this._modalService.runModal(
      ArticleEditorModalComponent,
      'create:articles',
      {},
      (result) => this._apiArticleService.createArticle(result),
      this.reloadTrigger$
    )
  }

  public deleteArticle(id: number) {
    this._modalService.runModal(
      ConfirmModalComponent,
      'delete:articles',
      {
        title: 'Are you sure you want to remove this article?',
      },
      (_result) => this._apiArticleService.deleteArticle(id),
      this.reloadTrigger$
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
