import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleEditorModalComponent } from './article-editor-modal.component';

describe('ArticleEditorModalComponent', () => {
  let component: ArticleEditorModalComponent;
  let fixture: ComponentFixture<ArticleEditorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleEditorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
