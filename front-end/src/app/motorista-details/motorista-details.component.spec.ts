import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaDetailsComponent } from './motorista-details.component';

describe('MotoristaDetailsComponent', () => {
  let component: MotoristaDetailsComponent;
  let fixture: ComponentFixture<MotoristaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MotoristaDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotoristaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
