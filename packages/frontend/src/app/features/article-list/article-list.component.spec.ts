import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing'
import { of, Subject, throwError } from 'rxjs'
import { ArticleEditorModalComponent } from '../../core/modals/article-editor-modal/article-editor-modal.component'
import { ConfirmModalComponent } from '../../core/modals/confirm-modal/confirm-modal.component'
import { DTOArticle } from '../../models/dto-article.model'
import { ApiArticleService } from '../../services/api-article.service'
import { ModalService } from '../../services/modal.service'
import { ArticleListComponent } from './article-list.component'

describe('ArticleListComponent', () => {
  let component: ArticleListComponent
  let fixture: ComponentFixture<ArticleListComponent>
  let apiArticleServiceMock: jasmine.SpyObj<ApiArticleService>
  let modalServiceMock: jasmine.SpyObj<ModalService>

  beforeEach(async () => {
    apiArticleServiceMock = jasmine.createSpyObj('ApiArticleService', [
      'getArticles',
      'updateArticle',
      'createArticle',
      'deleteArticle',
    ])

    modalServiceMock = jasmine.createSpyObj('ModalService', ['runModal'])

    await TestBed.configureTestingModule({
      providers: [
        { provide: ApiArticleService, useValue: apiArticleServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleListComponent)
    component = fixture.componentInstance
  })

  describe('ngOnInit()', () => {
    it('should load articles on initialization', fakeAsync(() => {
      const mockArticles: DTOArticle[] = [
        { id: 1, title: 'Test Article' } as any,
      ]
      apiArticleServiceMock.getArticles.and.returnValue(of(mockArticles))

      component.ngOnInit()
      tick()

      expect(component.articles).toEqual(mockArticles)
    }))

    it('should handle error by setting articles to empty array', fakeAsync(() => {
      apiArticleServiceMock.getArticles.and.returnValue(
        throwError(() => new Error('fail'))
      )

      component.ngOnInit()
      tick()

      expect(component.articles).toEqual([])
    }))
  })

  describe('loadArticles()', () => {
    it('should call apiArticleService.getArticles()', () => {
      const spy = apiArticleServiceMock.getArticles.and.returnValue(of([]))

      const result = component.loadArticles()

      expect(spy).toHaveBeenCalled()
      result.subscribe((articles) => expect(articles).toEqual([]))
    })
  })

  describe('editArticle()', () => {
    it('should call modalService.runModal with ArticleEditorModalComponent and update permission', () => {
      const id = 42
      component.editArticle(id)
      expect(modalServiceMock.runModal).toHaveBeenCalledWith(
        ArticleEditorModalComponent,
        'update:articles',
        { id },
        jasmine.any(Function),
        jasmine.any(Subject)
      )
    })
  })

  describe('createNewArticle()', () => {
    it('should call modalService.runModal with ArticleEditorModalComponent and create permission', () => {
      component.createNewArticle()
      expect(modalServiceMock.runModal).toHaveBeenCalledWith(
        ArticleEditorModalComponent,
        'create:articles',
        {},
        jasmine.any(Function),
        jasmine.any(Subject)
      )
    })
  })

  describe('deleteArticle()', () => {
    it('should call modalService.runModal with ConfirmModalComponent and delete permission', () => {
      const id = 99
      component.deleteArticle(id)
      expect(modalServiceMock.runModal).toHaveBeenCalledWith(
        ConfirmModalComponent,
        'delete:articles',
        { title: 'Are you sure you want to remove this article?' },
        jasmine.any(Function),
        jasmine.any(Subject)
      )
    })
  })

  describe('ngOnDestroy()', () => {
    it('should complete destroy$ subject', () => {
      spyOn(component['destroy$'], 'next')
      spyOn(component['destroy$'], 'complete')

      component.ngOnDestroy()

      expect(component['destroy$'].next).toHaveBeenCalled()
      expect(component['destroy$'].complete).toHaveBeenCalled()
    })
  })
})
