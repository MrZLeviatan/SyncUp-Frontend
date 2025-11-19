import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaArtistas } from './lista-artistas';

describe('ListaArtistas', () => {
  let component: ListaArtistas;
  let fixture: ComponentFixture<ListaArtistas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaArtistas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaArtistas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
