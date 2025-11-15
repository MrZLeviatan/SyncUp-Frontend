import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarAdmin } from './top-bar-admin';

describe('TopBarAdmin', () => {
  let component: TopBarAdmin;
  let fixture: ComponentFixture<TopBarAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBarAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopBarAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
