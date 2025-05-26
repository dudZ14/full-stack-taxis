import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerActionsComponent } from './manager-actions.component';

describe('ManagerActionsComponent', () => {
  let component: ManagerActionsComponent;
  let fixture: ComponentFixture<ManagerActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
