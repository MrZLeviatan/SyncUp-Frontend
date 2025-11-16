import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCanciones } from './lista-canciones';

describe('ListaCanciones', () => {
  let component: ListaCanciones;
  let fixture: ComponentFixture<ListaCanciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaCanciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCanciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
