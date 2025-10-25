import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqueteDetatilComponent } from './enquete-detatil.component';

describe('EnqueteDetatilComponent', () => {
  let component: EnqueteDetatilComponent;
  let fixture: ComponentFixture<EnqueteDetatilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnqueteDetatilComponent]
    });
    fixture = TestBed.createComponent(EnqueteDetatilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
