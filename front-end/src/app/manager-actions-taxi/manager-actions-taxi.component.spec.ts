import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerActionsTaxiComponent } from './manager-actions-taxi.component';

describe('ManagerActionsTaxiComponent', () => {
  let component: ManagerActionsTaxiComponent;
  let fixture: ComponentFixture<ManagerActionsTaxiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerActionsTaxiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerActionsTaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
