import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviEnqueteComponent } from './suivi-enquete.component';

describe('SuiviEnqueteComponent', () => {
  let component: SuiviEnqueteComponent;
  let fixture: ComponentFixture<SuiviEnqueteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuiviEnqueteComponent]
    });
    fixture = TestBed.createComponent(SuiviEnqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
