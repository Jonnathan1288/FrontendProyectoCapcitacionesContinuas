import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardcursoComponent } from './cardcurso.component';

describe('CardcursoComponent', () => {
  let component: CardcursoComponent;
  let fixture: ComponentFixture<CardcursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardcursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardcursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
