import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPersonaComponent } from './registrar-persona.component';

describe('RegistrarPersonaComponent', () => {
  let component: RegistrarPersonaComponent;
  let fixture: ComponentFixture<RegistrarPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarPersonaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
