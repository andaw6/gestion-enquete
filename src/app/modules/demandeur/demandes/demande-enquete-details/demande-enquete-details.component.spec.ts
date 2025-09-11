import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeEnqueteDetailsComponent } from './demande-enquete-details.component';

describe('DemandeEnqueteDetailsComponent', () => {
  let component: DemandeEnqueteDetailsComponent;
  let fixture: ComponentFixture<DemandeEnqueteDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemandeEnqueteDetailsComponent]
    });
    fixture = TestBed.createComponent(DemandeEnqueteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
