import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { CancionService } from '../../../core/services/canciones/cancion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metricas-sistema',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './metricas-sistema.html',
  styleUrls: ['./metricas-sistema.css'],
})
export class MetricasSistema implements OnInit {
  totalCanciones = 0;
  artistaTop = '';
  cancionesPorGeneroLabels: string[] = [];
  cancionesPorGeneroData: number[] = [];

  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      { data: [], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] },
    ],
  };

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ label: 'Canciones por género', data: [], backgroundColor: '#36A2EB' }],
  };

  constructor(private cancionService: CancionService) {}

  ngOnInit(): void {
    this.cargarMetricas();
  }

  cargarMetricas() {
    this.cancionService.obtenerMetricas().subscribe((metricas: any) => {
      this.totalCanciones = metricas.totalCanciones;
      this.artistaTop = metricas.artistaTop;

      const porGenero = metricas.cancionesPorGenero;
      this.cancionesPorGeneroLabels = Object.keys(porGenero);
      this.cancionesPorGeneroData = Object.values(porGenero);

      this.pieChartData.labels = this.cancionesPorGeneroLabels;
      this.pieChartData.datasets[0].data = this.cancionesPorGeneroData;

      this.barChartData.labels = this.cancionesPorGeneroLabels;
      this.barChartData.datasets[0].data = this.cancionesPorGeneroData;
    });
  }
}
