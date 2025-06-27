import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPreviewModalComponent } from './document-preview-modal.component';

describe('DocumentPreviewModalComponent', () => {
  let component: DocumentPreviewModalComponent;
  let fixture: ComponentFixture<DocumentPreviewModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentPreviewModalComponent]
    });
    fixture = TestBed.createComponent(DocumentPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
