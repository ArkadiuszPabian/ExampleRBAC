import { NgIf } from '@angular/common'
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Subscription } from 'rxjs'
import { AutofocusAfterInitDirective } from '../../../directives/autofocus-after-init.directive'
import { DTOEditArticle } from '../../../models/dto-edit-article.model'
import { ModalModel } from '../../../models/modal.model'
import { ApiArticleService } from '../../../services/api-article.service'
import { ApiAuthService } from '../../../services/api-auth.service'
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-article-editor-modal',
  imports: [
    ReactiveFormsModule,
    NgIf,
    AutofocusAfterInitDirective,
  ],
  templateUrl: './article-editor-modal.component.html',
  styleUrl: './article-editor-modal.component.scss',
})
export class ArticleEditorModalComponent
  extends ModalModel<DTOEditArticle>
  implements OnInit, OnDestroy
{
  private readonly _formBuilder = inject(FormBuilder)
  private readonly _authService = inject(AuthService)
  private readonly _apiArticleService = inject(ApiArticleService)
  private readonly _apiAuthService = inject(ApiAuthService)
  private readonly _subscription = new Subscription()

  public form!: FormGroup
  public isLoading = true

  public get isEditing() {
    return !!this.id
  }

  ngOnInit(): void {
    if (this.isEditing) {
      this._subscription.add(
        this._apiArticleService.getSingleArticle(this.id!).subscribe({
          next: (article) => {
            this.form = this._formBuilder.group({
              title: [article.title, [Validators.required]],
              content: [article.content],
              isPublished: [article.isPublished],
              authorId: [article.authorId],
            })
            this.isLoading = false
          },
        })
      )
    } else {
      this._subscription.add(
        this._apiAuthService.status().subscribe({
          next: () => {
            this.form = this._formBuilder.group({
              title: ['', [Validators.required]],
              content: [''],
              isPublished: [false],
              authorId: [this._authService.getUserId()],
            })
          },
          complete: () => {
            this.isLoading = false
          },
        })
      )
    }
  }

  public get titleField() {
    return this.form.get('title')
  }

  public get isTitleInvalid() {
    return (this.titleField?.dirty && this.titleField?.invalid) === true
      ? true
      : undefined
  }

  public get title() {
    return this.isEditing === false ? 'Create new article' : 'Edit article'
  }

  @Input() id?: number

  save() {
    const article: DTOEditArticle = {
      title: this.form.get('title')?.value,
      content: this.form.get('content')?.value,
      isPublished: this.form.get('isPublished')?.value,
      authorId: this.form.get('authorId')?.value,
    }

    this.result.emit(article)
  }

  cancel() {
    this.result.emit(null)
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
