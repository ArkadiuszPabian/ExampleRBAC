import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleEditorModalComponent } from './role-editor-modal.component';

describe('RoleEditorModalComponent', () => {
  let component: RoleEditorModalComponent;
  let fixture: ComponentFixture<RoleEditorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleEditorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
