import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeTerminerComponent } from './demande-terminer.component';

describe('DemandeTerminerComponent', () => {
  let component: DemandeTerminerComponent;
  let fixture: ComponentFixture<DemandeTerminerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeTerminerComponent]
    });
    fixture = TestBed.createComponent(DemandeTerminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
