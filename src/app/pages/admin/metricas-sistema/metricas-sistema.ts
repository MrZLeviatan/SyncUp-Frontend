import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { CancionService } from '../../../core/services/cancion.service';

@Component({
  selector: 'app-metricas-sistema',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './metricas-sistema.html',
  styleUrls: ['./metricas-sistema.css'],
})
export class MetricasSistema implements OnInit {
  // ES: métricas simples
  // EN: simple metrics
  totalCanciones = 0;
  artistaTop = '';

  // ES: datos por género
  cancionesPorGeneroLabels: string[] = [];
  cancionesPorGeneroData: number[] = [];

  // ES: top 5 artistas
  top5Labels: string[] = [];
  top5Data: number[] = [];

  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#ff5900ff', '#10cd65ff', '#04afc2ff', '#6946e7ff', '#7d0808ff'],
      },
    ],
  };

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ label: 'Canciones por género', data: [], backgroundColor: '#35be0fff' }],
  };

  // ES: gráfico top 5 artistas
  barTop5Data: ChartData<'bar'> = {
    labels: [],
    datasets: [{ label: 'Top 5 artistas', data: [], backgroundColor: '#9a3bbf' }],
  };

  constructor(private cancionService: CancionService) {}

  ngOnInit(): void {
    this.cargarMetricas();
  }

  cargarMetricas() {
    this.cancionService.obtenerMetricas().subscribe((metricas: any) => {
      this.totalCanciones = metricas.totalCanciones;
      this.artistaTop = metricas.artistaTop;

      /* === Canciones por género === */
      const porGenero = metricas.cancionesPorGenero;
      this.cancionesPorGeneroLabels = Object.keys(porGenero);
      this.cancionesPorGeneroData = Object.values(porGenero);

      this.pieChartData.labels = this.cancionesPorGeneroLabels;
      this.pieChartData.datasets[0].data = this.cancionesPorGeneroData;

      this.barChartData.labels = this.cancionesPorGeneroLabels;
      this.barChartData.datasets[0].data = this.cancionesPorGeneroData;

      /* === Top 5 Artistas === */
      const top5 = metricas.top5Artistas || [];

      this.top5Labels = top5.map((item: any) => item.key);
      this.top5Data = top5.map((item: any) => item.value);

      this.barTop5Data.labels = this.top5Labels;
      console.log('Top 5 Labels:', this.top5Labels);
      this.barTop5Data.datasets[0].data = this.top5Data;
    });
  }
}
