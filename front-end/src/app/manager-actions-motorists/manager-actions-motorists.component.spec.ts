import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerActionsMotoristsComponent } from './manager-actions-motorists.component';

describe('ManagerActionsMotoristsComponent', () => {
  let component: ManagerActionsMotoristsComponent;
  let fixture: ComponentFixture<ManagerActionsMotoristsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerActionsMotoristsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerActionsMotoristsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
