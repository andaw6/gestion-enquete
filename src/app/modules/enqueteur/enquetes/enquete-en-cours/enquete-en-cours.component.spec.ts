import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqueteEnCoursComponent } from './enquete-en-cours.component';

describe('EnqueteEnCoursComponent', () => {
  let component: EnqueteEnCoursComponent;
  let fixture: ComponentFixture<EnqueteEnCoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnqueteEnCoursComponent]
    });
    fixture = TestBed.createComponent(EnqueteEnCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
