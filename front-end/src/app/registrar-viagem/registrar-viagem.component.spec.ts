import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarViagemComponent } from './registrar-viagem.component';

describe('RegistrarViagemComponent', () => {
  let component: RegistrarViagemComponent;
  let fixture: ComponentFixture<RegistrarViagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarViagemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarViagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
