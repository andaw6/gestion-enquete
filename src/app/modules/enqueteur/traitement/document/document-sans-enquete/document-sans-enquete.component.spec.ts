import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSansEnqueteComponent } from './document-sans-enquete.component';

describe('DocumentSansEnqueteComponent', () => {
  let component: DocumentSansEnqueteComponent;
  let fixture: ComponentFixture<DocumentSansEnqueteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentSansEnqueteComponent]
    });
    fixture = TestBed.createComponent(DocumentSansEnqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
