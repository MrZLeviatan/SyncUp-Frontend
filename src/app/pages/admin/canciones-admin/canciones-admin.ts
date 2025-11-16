import { Component, OnInit } from '@angular/core';
import { ListaCanciones } from '../../../components/lista-canciones/lista-canciones';
import { CancionDto } from '../../../core/models/dto/cancion/cancion.dto';
import { CancionService } from '../../../core/services/canciones/cancion.service';

@Component({
  selector: 'app-canciones-admin',
  standalone: true,
  imports: [ListaCanciones],
  templateUrl: './canciones-admin.html',
  styleUrls: ['./canciones-admin.css'],
})
export class CancionesAdminComponent implements OnInit {
  canciones: CancionDto[] = []; // Arreglo de canciones cargadas
  alturaLista = 250;

  constructor(private cancionService: CancionService) {}

  ngOnInit(): void {
    this.cargarCancionesGenerales();
  }

  cargarCancionesGenerales() {
    this.cancionService.obtenerCancionesGeneral().subscribe({
      next: (res) => {
        this.canciones = res; // ya es un array puro
        console.log(this.canciones);
      },
      error: (err) => console.error(err),
    });
  }

  recibirCancionSeleccionada(cancion: CancionDto) {
    console.log('Cancion seleccionada:', cancion);
  }
}
