import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentFiltersComponent } from './document-filters.component';

describe('DocumentFiltersComponent', () => {
  let component: DocumentFiltersComponent;
  let fixture: ComponentFixture<DocumentFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentFiltersComponent]
    });
    fixture = TestBed.createComponent(DocumentFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
