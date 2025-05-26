import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristOptionsComponent } from './motorist-options.component';

describe('MotoristOptionsComponent', () => {
  let component: MotoristOptionsComponent;
  let fixture: ComponentFixture<MotoristOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MotoristOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotoristOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
