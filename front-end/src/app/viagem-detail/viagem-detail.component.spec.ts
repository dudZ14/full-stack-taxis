import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViagemDetailComponent } from './viagem-detail.component';

describe('ViagemDetailComponent', () => {
  let component: ViagemDetailComponent;
  let fixture: ComponentFixture<ViagemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViagemDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViagemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
