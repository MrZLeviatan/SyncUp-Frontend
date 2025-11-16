import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarUsuarios } from './top-bar-usuarios';

describe('TopBarUsuarios', () => {
  let component: TopBarUsuarios;
  let fixture: ComponentFixture<TopBarUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBarUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopBarUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
