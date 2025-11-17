import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricasSistema } from './metricas-sistema';

describe('MetricasSistema', () => {
  let component: MetricasSistema;
  let fixture: ComponentFixture<MetricasSistema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricasSistema]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricasSistema);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
