import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSansEnqueteFiltreComponent } from './document-sans-enquete-filtre.component';

describe('DocumentSansEnqueteFiltreComponent', () => {
  let component: DocumentSansEnqueteFiltreComponent;
  let fixture: ComponentFixture<DocumentSansEnqueteFiltreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentSansEnqueteFiltreComponent]
    });
    fixture = TestBed.createComponent(DocumentSansEnqueteFiltreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
