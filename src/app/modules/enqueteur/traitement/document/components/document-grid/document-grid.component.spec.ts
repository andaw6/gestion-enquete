import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentGridComponent } from './document-grid.component';

describe('DocumentGridComponent', () => {
  let component: DocumentGridComponent;
  let fixture: ComponentFixture<DocumentGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentGridComponent]
    });
    fixture = TestBed.createComponent(DocumentGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
