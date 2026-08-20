import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jovenes } from './jovenes';

describe('Jovenes', () => {
  let component: Jovenes;
  let fixture: ComponentFixture<Jovenes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jovenes],
    }).compileComponents();

    fixture = TestBed.createComponent(Jovenes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
