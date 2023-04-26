import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculComponent } from './matricul.component';

describe('MatriculComponent', () => {
  let component: MatriculComponent;
  let fixture: ComponentFixture<MatriculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatriculComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatriculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
