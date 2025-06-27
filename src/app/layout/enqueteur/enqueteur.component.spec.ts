import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqueteurComponent } from './enqueteur.component';

describe('EnqueteurComponent', () => {
  let component: EnqueteurComponent;
  let fixture: ComponentFixture<EnqueteurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnqueteurComponent]
    });
    fixture = TestBed.createComponent(EnqueteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
