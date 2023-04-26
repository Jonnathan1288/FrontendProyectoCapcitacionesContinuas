import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitadorComponent } from './capacitador.component';

describe('CapacitadorComponent', () => {
  let component: CapacitadorComponent;
  let fixture: ComponentFixture<CapacitadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapacitadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacitadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
