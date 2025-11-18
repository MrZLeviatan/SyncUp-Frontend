import { Component, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CancionDto } from '../../core/models/dto/cancion/cancion.dto';
import { ArtistaService } from '../../core/services/artista.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CancionBusquedaService } from '../../core/services/canciones/cancion-busqueda.service';
import { ArtistaDto } from '../../core/models/dto/artista/artista.dto';
import { GeneroMusical } from '../../core/models/enum/genero-musical.enum';
import { EventEmitter } from '@angular/core';

/**
 * Componente encargado de mostrar y administrar la lista de canciones,
 * permitiendo búsquedas por título, filtrado por artista, género y año.
 * También carga información de artistas según las canciones mostradas.
 */
@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-lista-canciones',
  templateUrl: './lista-canciones.html',
  styleUrls: ['./lista-canciones.css'],
})
export class ListaCanciones implements OnInit, OnChanges {
  /** Altura definida desde el componente padre para ajustar el tamaño visual de la lista.*/
  @Input() alturaLista: number = 300;

  @Output() cancionSeleccionada = new EventEmitter<CancionDto>();

  /** Lista inicial de canciones proporcionada por el componente padre.*/
  @Input() canciones: CancionDto[] = [];

  /** Mapa que almacena los nombres de artistas según su ID para evitar múltiples consultas repetidas. */
  artistasMap: Record<number, string> = {};

  /** Texto ingresado por el usuario para la búsqueda por título de canción.*/
  textoBusqueda: string = '';

  /** Copia de todas las canciones recibidas inicialmente, usada para restaurar resultados. */
  cancionesGenerales: CancionDto[] = [];

  /** Texto ingresado para buscar artistas por autocompletar.*/
  textoArtista: string = '';

  /** Lista de artistas sugeridos por autocompletado. */
  listaArtistas: ArtistaDto[] = [];

  /** ID del artista actualmente seleccionado en el filtro. */
  artistaSeleccionadoId: number | null = null;

  /** Lista de géneros musicales obtenidos del enum. */
  generos = Object.values(GeneroMusical);

  /** Lista de años generada dinámicamente desde el año actual hasta 1950. */
  anios: number[] = [];

  /** Controla la visibilidad del menú de selección de género. */
  mostrarGenero = false;

  /** Controla la visibilidad del menú de años.*/
  mostrarAnios = false;

  /** Género seleccionado para el filtro.*/
  generoSeleccionado: string | null = null;

  /** Año seleccionado para el filtro.*/
  anioSeleccionado: number | null = null;

  /**
   * @constructor
   * @param artistaService Servicio para obtener información de artistas.
   * @param busquedaService Servicio para búsquedas y filtros de canciones.
   */
  constructor(
    private artistaService: ArtistaService,
    private busquedaService: CancionBusquedaService
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Carga la copia general de canciones, obtiene artistas asociados y genera la lista de años.
   */
  ngOnInit() {
    this.cancionesGenerales = [...this.canciones];
    this.cargarArtistas();

    const actual = new Date().getFullYear();
    for (let y = actual; y >= 1950; y--) this.anios.push(y);
  }

  /**
   * Método del ciclo de vida que se ejecuta cuando cambian los @Input.
   * Se actualiza la lista de canciones generales y se recarga la información de artistas.
   * @param changes Representa los cambios detectados en propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['canciones'] && changes['canciones'].currentValue) {
      this.cancionesGenerales = [...changes['canciones'].currentValue];
      this.cargarArtistas();
    }
  }

  // Cuando se hace clic en una canción
  seleccionarCancion(cancion: CancionDto) {
    this.cancionSeleccionada.emit(cancion);
  }

  /**
   * Carga los nombres de los artistas asociados a cada canción actual.
   * Se optimiza cargando solo los artistas no registrados previamente.
   */
  cargarArtistas() {
    this.canciones.forEach((c) => {
      if (!this.artistasMap[c.idArtista]) {
        this.artistaService.obtenerArtistaPorId(c.idArtista).subscribe((res: any) => {
          this.artistasMap[c.idArtista] = res.mensaje.nombreArtistico;
        });
      }
    });
  }

  /**
   * Realiza la búsqueda de canciones por título.
   * Si el texto está vacío, restaura la lista original.
   */
  buscarCanciones() {
    const texto = this.textoBusqueda.trim();

    if (!texto) {
      this.canciones = [...this.cancionesGenerales];
      this.cargarArtistas();
      return;
    }

    this.busquedaService.autocompletarCanciones(texto).subscribe({
      next: (res: any) => {
        const lista = res?.mensaje || [];
        this.canciones = this.filtrarContraListaPadre(lista);
        this.cargarArtistas();
      },
      error: (err) => {
        console.error('Error buscando canciones', err);
      },
    });
  }

  /**
   * Busca artistas según el texto ingresado para autocompletar.
   */
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

  /**
   * Selecciona un artista desde la lista de autocompletado.
   * @param artista Artista elegido por el usuario.
   */
  seleccionarArtista(artista: ArtistaDto) {
    this.textoArtista = artista.nombreArtistico;
    this.artistaSeleccionadoId = artista.id;
    this.listaArtistas = [];
  }

  /** Alterna la visibilidad del menú de géneros. */
  toggleGenero() {
    this.mostrarGenero = !this.mostrarGenero;
  }

  /** Alterna la visibilidad del menú de años. */
  toggleAnios() {
    this.mostrarAnios = !this.mostrarAnios;
  }

  /**
   * Selecciona un género musical como filtro.
   * @param g Género musical seleccionado.
   */
  seleccionarGenero(g: string) {
    this.generoSeleccionado = g;
    this.mostrarGenero = false;
  }

  /**
   * Selecciona un año de lanzamiento como filtro.
   * @param y Año seleccionado.
   */
  seleccionarAnio(y: number) {
    this.anioSeleccionado = y;
    this.mostrarAnios = false;
  }

  /**
   * Aplica los filtros seleccionados (artista, género y año)
   * realizando una búsqueda avanzada en el backend.
   */
  aplicarFiltros() {
    const artista = this.artistaSeleccionadoId ? this.artistaSeleccionadoId.toString() : undefined;
    const genero = this.generoSeleccionado || undefined;
    const anio = this.anioSeleccionado || undefined;

    this.busquedaService.listarCancionesFiltro(artista, genero, anio, 0, 20).subscribe({
      next: (res: any) => {
        const lista = res || [];
        this.canciones = this.filtrarContraListaPadre(lista);
        this.cargarArtistas();
      },
      error: (err) => {
        console.error('Error filtrando canciones', err);
      },
    });
  }

  /**
   * Filtra cualquier lista externa para que solo muestre canciones
   * que existan en la lista actual del componente padre.
   */
  private filtrarContraListaPadre(lista: CancionDto[]): CancionDto[] {
    const idsPadre = new Set(this.cancionesGenerales.map((c) => c.id));
    return lista.filter((c) => idsPadre.has(c.id));
  }

  /**
   * Restablece todos los filtros y campos de búsqueda devolviendo la lista original.
   */
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
