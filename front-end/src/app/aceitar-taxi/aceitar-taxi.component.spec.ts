import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceitarTaxiComponent } from './aceitar-taxi.component';

describe('AceitarTaxiComponent', () => {
  let component: AceitarTaxiComponent;
  let fixture: ComponentFixture<AceitarTaxiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AceitarTaxiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceitarTaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
