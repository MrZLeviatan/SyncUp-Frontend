import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponente } from './login';

describe('Login', () => {
  let component: LoginComponente;
  let fixture: ComponentFixture<LoginComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponente],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
