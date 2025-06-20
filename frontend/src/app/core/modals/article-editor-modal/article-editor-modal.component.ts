import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DTOArticle } from '../../../models/dto-article.model';

@Component({
  selector: 'app-article-editor-modal',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './article-editor-modal.component.html',
  styleUrl: './article-editor-modal.component.scss'
})
export class ArticleEditorModalComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder)

  public form!: FormGroup

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      title: [this.article.title, [Validators.required]],
      content: [this.article.content],
      isPublished: [this.article.isPublished]
    })
  }

  public get titleField() {
    return this.form.get('password')
  }

  public get isTitleInvalid() {
    return (this.titleField?.dirty && this.titleField?.invalid) === true ? true : undefined
  }

  @Input() article!: DTOArticle

  @Output() result = new EventEmitter<DTOArticle | null>()

  save() {

    this.article.title = this.form.get('title')?.value
    this.article.content = this.form.get('content')?.value
    this.article.isPublished = this.form.get('isPublished')?.value
    this.result.emit(this.article)
  }

  cancel() {
    this.result.emit(null)
  }
}
