import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CancionDto } from '../../core/models/dto/cancion/cancion.dto';
import { ArtistaService } from '../../core/services/artista.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CancionBusquedaService } from '../../core/services/canciones/cancion-busqueda.service';
import { ArtistaDto } from '../../core/models/dto/artista/artista.dto';
import { GeneroMusical } from '../../core/models/enum/genero-musical.enum';

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
  textoBusqueda: string = '';
  cancionesGenerales: CancionDto[] = []; // para restaurar

  textoArtista: string = '';
  listaArtistas: ArtistaDto[] = [];
  artistaSeleccionadoId: number | null = null;

  generos = Object.values(GeneroMusical);
  anios: number[] = [];
  mostrarGenero = false;
  mostrarAnios = false;

  generoSeleccionado: string | null = null;
  anioSeleccionado: number | null = null;

  constructor(
    private artistaService: ArtistaService,
    private busquedaService: CancionBusquedaService
  ) {}

  ngOnInit() {
    // Guardamos las canciones generales al inicializar
    this.cancionesGenerales = [...this.canciones];
    this.cargarArtistas();

    // generar años dinámicos
    const actual = new Date().getFullYear();
    for (let y = actual; y >= 1950; y--) this.anios.push(y);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['canciones'] && changes['canciones'].currentValue) {
      this.cancionesGenerales = [...changes['canciones'].currentValue];
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

  buscarCanciones() {
    const texto = this.textoBusqueda.trim();
    if (!texto) {
      // Si el buscador está vacío, restauramos canciones generales
      this.canciones = [...this.cancionesGenerales];

      this.cargarArtistas();
      return;
    }

    // Llamamos al servicio de búsqueda
    this.busquedaService.autocompletarCanciones(texto).subscribe({
      next: (res: any) => {
        // Asegúrate de usar el array real
        this.canciones = res?.mensaje || [];
        console.log(res);
      },
      error: (err) => {
        console.error('Error buscando canciones', err);
      },
    });
  }

  buscarArtistas() {
    const texto = this.textoArtista.trim();

    if (!texto) {
      this.listaArtistas = [];
      return;
    }

    this.artistaService.autocompletarArtistas(texto).subscribe({
      next: (res: any) => {
        this.listaArtistas = res?.mensaje || [];
      },
      error: (err) => {
        console.error('Error buscando artistas', err);
      },
    });
  }

  seleccionarArtista(artista: ArtistaDto) {
    this.textoArtista = artista.nombreArtistico; // Mostrar el nombre
    this.artistaSeleccionadoId = artista.id; // Guardar el ID
    this.listaArtistas = []; // Ocultar lista

    console.log('ID del artista seleccionado:', this.artistaSeleccionadoId);
  }

  toggleGenero() {
    this.mostrarGenero = !this.mostrarGenero;
  }

  toggleAnios() {
    this.mostrarAnios = !this.mostrarAnios;
  }

  seleccionarGenero(g: string) {
    this.generoSeleccionado = g;
    this.mostrarGenero = false;
    console.log('Género seleccionado:', g);
  }

  seleccionarAnio(y: number) {
    this.anioSeleccionado = y;
    this.mostrarAnios = false;
    console.log('Año seleccionado:', y);
  }

  aplicarFiltros() {
    const artista = this.artistaSeleccionadoId ? this.artistaSeleccionadoId.toString() : undefined;
    const genero = this.generoSeleccionado || undefined;
    const anio = this.anioSeleccionado || undefined;

    this.busquedaService.listarCancionesFiltro(artista, genero, anio, 0, 20).subscribe({
      next: (res: any) => {
        console.log('Respuesta filtros:', res);

        this.canciones = res || [];
        this.cargarArtistas();
      },
      error: (err) => {
        console.error('Error filtrando canciones', err);
      },
    });
  }

  limpiarFiltros() {
    this.textoBusqueda = '';
    this.textoArtista = '';
    this.artistaSeleccionadoId = null;
    this.generoSeleccionado = null;
    this.anioSeleccionado = null;

    this.canciones = [...this.cancionesGenerales];
    this.cargarArtistas();
  }
}
