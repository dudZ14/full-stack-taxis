import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristActionsComponent } from './motorist-actions.component';

describe('MotoristActionsComponent', () => {
  let component: MotoristActionsComponent;
  let fixture: ComponentFixture<MotoristActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MotoristActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotoristActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
