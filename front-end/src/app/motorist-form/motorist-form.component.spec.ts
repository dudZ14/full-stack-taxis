import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristFormComponent } from './motorist-form.component';

describe('MotoristFormComponent', () => {
  let component: MotoristFormComponent;
  let fixture: ComponentFixture<MotoristFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MotoristFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotoristFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
