import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { of } from 'rxjs'
import { ApiArticleService } from '../../../services/api-article.service'
import { ApiAuthService } from '../../../services/api-auth.service'
import { AuthService } from '../../../services/auth.service'
import { ArticleEditorModalComponent } from './article-editor-modal.component'

describe('ArticleEditorModalComponent (public API only)', () => {
  let component: ArticleEditorModalComponent
  let fixture: ComponentFixture<ArticleEditorModalComponent>

  const mockArticle = {
    title: 'Test Title',
    content: 'Test Content',
    isPublished: true,
    authorId: 1,
  }

  const apiArticleServiceMock = {
    getSingleArticle: jasmine.createSpy().and.returnValue(of(mockArticle)),
  }

  const apiAuthServiceMock = {
    status: jasmine.createSpy().and.returnValue(of(null)),
  }

  const authServiceMock = {
    getUserId: jasmine.createSpy().and.returnValue(1),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ApiArticleService, useValue: apiArticleServiceMock },
        { provide: ApiAuthService, useValue: apiAuthServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        FormBuilder,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ArticleEditorModalComponent)
    component = fixture.componentInstance
  })

  it('should initialize in create mode (no id)', () => {
    component.id = undefined
    component.ngOnInit()
    expect(component.title).toBe('Create new article')
    expect(component.isEditing).toBeFalse()
    expect(component.form).toBeDefined()
  })

  it('should initialize in edit mode (with id)', () => {
    component.id = 1
    component.ngOnInit()
    expect(component.title).toBe('Edit article')
    expect(component.isEditing).toBeTrue()
    expect(component.form?.value.title).toBe(mockArticle.title)
  })

  it('should emit article on save()', () => {
    spyOn(component.result, 'emit')
    const fb = TestBed.inject(FormBuilder)
    component.form = fb.group(mockArticle)
    component.save()
    expect(component.result.emit).toHaveBeenCalledWith(mockArticle)
  })

  it('should emit null on cancel()', () => {
    spyOn(component.result, 'emit')
    component.cancel()
    expect(component.result.emit).toHaveBeenCalledWith(null)
  })

  it('should compute isTitleInvalid correctly', () => {
    const fb = TestBed.inject(FormBuilder)
    component.form = fb.group({
      title: [''],
      content: [''],
      isPublished: [false],
      authorId: [1],
    })
    const titleControl = component.titleField
    titleControl?.markAsDirty()
    titleControl?.setErrors({ required: true })
    expect(component.isTitleInvalid).toBeTrue()
  })
})
