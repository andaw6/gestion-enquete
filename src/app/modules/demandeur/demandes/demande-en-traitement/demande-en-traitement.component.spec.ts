import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeEnTraitementComponent } from './demande-en-traitement.component';

describe('DemandeEnTraitementComponent', () => {
  let component: DemandeEnTraitementComponent;
  let fixture: ComponentFixture<DemandeEnTraitementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeEnTraitementComponent]
    });
    fixture = TestBed.createComponent(DemandeEnTraitementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
