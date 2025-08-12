import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqueteComponent } from './enquete.component';

describe('EnqueteComponent', () => {
  let component: EnqueteComponent;
  let fixture: ComponentFixture<EnqueteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnqueteComponent]
    });
    fixture = TestBed.createComponent(EnqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
