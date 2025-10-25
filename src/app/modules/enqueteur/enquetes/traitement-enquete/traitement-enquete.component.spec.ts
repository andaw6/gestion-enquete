import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraitementEnqueteComponent } from './traitement-enquete.component';

describe('TraitementEnqueteComponent', () => {
  let component: TraitementEnqueteComponent;
  let fixture: ComponentFixture<TraitementEnqueteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TraitementEnqueteComponent]
    });
    fixture = TestBed.createComponent(TraitementEnqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
