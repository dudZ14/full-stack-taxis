import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerActionsReportsComponent } from './manager-actions-reports.component';

describe('ManagerActionsReportsComponent', () => {
  let component: ManagerActionsReportsComponent;
  let fixture: ComponentFixture<ManagerActionsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerActionsReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerActionsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
