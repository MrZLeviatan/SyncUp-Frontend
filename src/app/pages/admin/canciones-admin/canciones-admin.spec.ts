import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancionesAdmin } from './canciones-admin';

describe('CancionesAdmin', () => {
  let component: CancionesAdmin;
  let fixture: ComponentFixture<CancionesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancionesAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancionesAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
