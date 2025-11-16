import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CancionDto } from '../../core/models/dto/cancion/cancion.dto';
import { ArtistaService } from '../../core/services/artista.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-lista-canciones',
  templateUrl: './lista-canciones.html',
  styleUrls: ['./lista-canciones.css'],
})
export class ListaCanciones implements OnInit, OnChanges {
  @Input() alturaLista: number = 300;
  @Input() canciones: CancionDto[] = [];

  artistasMap: Record<number, string> = {};

  constructor(private artistaService: ArtistaService) {}

  ngOnInit() {
    // Por si ya hay canciones al inicializar
    this.cargarArtistas();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['canciones'] && this.canciones?.length) {
      this.cargarArtistas();
    }
  }

  cargarArtistas() {
    this.canciones.forEach((c) => {
      if (!this.artistasMap[c.idArtista]) {
        this.artistaService.obtenerArtistaPorId(c.idArtista).subscribe((res: any) => {
          this.artistasMap[c.idArtista] = res.mensaje.nombreArtistico;
        });
      }
    });
  }
}
