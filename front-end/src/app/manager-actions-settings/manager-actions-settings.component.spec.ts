import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerActionsSettingsComponent } from './manager-actions-settings.component';

describe('ManagerActionsSettingsComponent', () => {
  let component: ManagerActionsSettingsComponent;
  let fixture: ComponentFixture<ManagerActionsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerActionsSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerActionsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
