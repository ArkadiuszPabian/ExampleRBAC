import { NgIf } from '@angular/common'
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Subscription } from 'rxjs'
import { DTOEditArticle } from '../../../models/dto-edit-article.model'
import { ApiArticleService } from '../../../services/api-article.service'
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-article-editor-modal',
  imports: [
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './article-editor-modal.component.html',
  styleUrl: './article-editor-modal.component.scss',
})
export class ArticleEditorModalComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder)
  private readonly _authService = inject(AuthService)
  private readonly _apiArticleService = inject(ApiArticleService)
  private readonly _subscription = new Subscription()

  public form!: FormGroup
  public isLoading = true

  ngOnInit(): void {
    if (this.id) {
      this._subscription.add(
        this._apiArticleService.getSingleArticle(this.id).subscribe({
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
      this.form = this._formBuilder.group({
        title: ['', [Validators.required]],
        content: [''],
        isPublished: [false],
        authorId: [this._authService.getUserId()],
      })
      this.isLoading = false
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
    return this.id === undefined ? 'Create new article' : 'Edit article'
  }

  @Input() id?: number

  @Output() result = new EventEmitter<DTOEditArticle | null>()

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
