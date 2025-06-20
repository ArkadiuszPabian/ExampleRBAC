import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { DTOEditArticle } from '../../../models/dto-edit-article.model'
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-article-editor-modal',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './article-editor-modal.component.html',
  styleUrl: './article-editor-modal.component.scss',
})
export class ArticleEditorModalComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder)
  private readonly _authService = inject(AuthService)

  public form!: FormGroup

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      title: [this.article?.title ?? '', [Validators.required]],
      content: [this.article?.content ?? ''],
      isPublished: [this.article?.isPublished ?? false],
    })
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
    return this.article === undefined ? 'Create new article' : 'Edit article'
  }

  @Input() article: DTOEditArticle | undefined

  @Output() result = new EventEmitter<DTOEditArticle | null>()

  save() {
    if (this.article === undefined) {
      const authorId = this._authService.getUserId()
      if (authorId === undefined) {
        console.debug(
          'Cannot get author id from token to save article, logging out...'
        )
        return this._authService.logout()
      }
      this.article = {
        title: this.form.get('title')?.value,
        content: this.form.get('content')?.value,
        isPublished: this.form.get('isPublished')?.value,
        authorId,
      }
    } else {
      this.article.title = this.form.get('title')?.value
      this.article.content = this.form.get('content')?.value
      this.article.isPublished = this.form.get('isPublished')?.value
    }
    this.result.emit(this.article)
  }

  cancel() {
    this.result.emit(null)
  }
}
