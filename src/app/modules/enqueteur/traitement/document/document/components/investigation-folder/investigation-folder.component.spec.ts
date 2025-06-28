import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationFolderComponent } from './investigation-folder.component';

describe('InvestigationFolderComponent', () => {
  let component: InvestigationFolderComponent;
  let fixture: ComponentFixture<InvestigationFolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestigationFolderComponent]
    });
    fixture = TestBed.createComponent(InvestigationFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
