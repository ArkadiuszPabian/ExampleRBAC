import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DTOEditArticle } from '../../../models/dto-edit-article.model'
import { DTOUser } from '../../../models/dto-user.model'
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-user-editor-modal',
  imports: [],
  templateUrl: './user-editor-modal.component.html',
  styleUrl: './user-editor-modal.component.scss',
})
export class UserEditorModalComponent {
  private readonly _formBuilder = inject(FormBuilder)
  private readonly _authService = inject(AuthService)

  public form!: FormGroup

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      username: [this.user?.username ?? '', [Validators.required]],
      isActivated: [this.user?.isActivated ?? false],
      role: [this.user?.roleName, [Validators.required]],
    })
  }

  public get title() {
    return this.user === undefined ? 'Create new user' : 'Edit user'
  }

  @Input() user: DTOUser | undefined

  @Output() result = new EventEmitter<DTOEditArticle | null>()

  save() {
    // if (this.user === undefined) {
    //   this.article = {
    //     title: this.form.get('title')?.value,
    //     content: this.form.get('content')?.value,
    //     isPublished: this.form.get('isPublished')?.value,
    //     authorId: this._authService.getUserId()
    //   }
    // } else {
    //   this.article.title = this.form.get('title')?.value
    //   this.article.content = this.form.get('content')?.value
    //   this.article.isPublished = this.form.get('isPublished')?.value
    // }
    // this.result.emit(this.article)
  }

  cancel() {
    this.result.emit(null)
  }
}
