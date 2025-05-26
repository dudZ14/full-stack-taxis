import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViagemFicticiaComponent } from './viagem-ficticia.component';

describe('ViagemFicticiaComponent', () => {
  let component: ViagemFicticiaComponent;
  let fixture: ComponentFixture<ViagemFicticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViagemFicticiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViagemFicticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
