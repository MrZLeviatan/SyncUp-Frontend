import { Component, Input } from '@angular/core';
import { ArtistaDto } from '../../core/models/dto/artista/artista.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-artistas',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './lista-artistas.html',
  styleUrl: './lista-artistas.css',
})
export class CollageArtistasComponent {
  /** Lista de artistas provenientes del componente padre.
   */
  @Input() artistas: ArtistaDto[] = [];

  /** Número de columnas configurables por el padre.
   */
  @Input() columnas: number = 3;

  /** Número de filas (si el padre desea limitar).
   */
  @Input() filas: number | null = null;

  /** Orientación: vertical u horizontal.
   */
  @Input() orientacion: 'vertical' | 'horizontal' = 'vertical';

  /** Tamaño de las tarjetas (pequeño/mediano/grande)
   */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Devuelve la lista recortada si el padre define un número de filas.
   */
  obtenerArtistasMostrados(): ArtistaDto[] {
    if (!this.filas) return this.artistas;

    const max = this.filas * this.columnas;
    return this.artistas.slice(0, max);
  }
}
