import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMotoristaComponent } from './edit-motorista.component';

describe('EditMotoristaComponent', () => {
  let component: EditMotoristaComponent;
  let fixture: ComponentFixture<EditMotoristaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditMotoristaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMotoristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
