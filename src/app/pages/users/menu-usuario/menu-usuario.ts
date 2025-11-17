import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancionDto } from '../../../core/models/dto/cancion/cancion.dto';
import { ListaCanciones } from '../../../components/lista-canciones/lista-canciones';
import { CancionService } from '../../../core/services/canciones/cancion.service';
import { ArtistaDto } from '../../../core/models/dto/artista/artista.dto';
import { ArtistaService } from '../../../core/services/artista.service';
import { TokenService } from '../../../core/auth/services/token.services';
import { RecomendacionService } from '../../../core/services/canciones/recomendacion.service';

/**
 * @class MenuUsuario
 * @description Componente principal del menú de usuario, encargado de:
 * - Mostrar lista de canciones
 * - Reproducir canciones
 * - Control de reproducción, tiempo y volumen
 * - Manejo de favoritos
 */
@Component({
  selector: 'app-menu-usuario',
  standalone: true,
  imports: [CommonModule, ListaCanciones],
  templateUrl: './menu-usuario.html',
  styleUrls: ['./menu-usuario.css'],
})
export class MenuUsuario implements OnInit {
  /** Lista de canciones disponibles */
  canciones: CancionDto[] = [];

  /** Canción actualmente seleccionada */
  cancionActual: CancionDto | null = null;

  /** Artista de la canción actual */
  artistaActual: ArtistaDto | null = null;

  /** Elemento HTML del reproductor */
  audioPlayer!: HTMLAudioElement;

  /** Control del tiempo */
  tiempoActual: string = '0:00';
  duracionTotal: string = '0:00';
  progreso: number = 0;

  /** Índice actual en la lista */
  indiceActual: number = -1;

  /** ▶ Estado de reproducción */
  reproduciendo: boolean = false;

  /** Indica si la canción actual es favorita */
  esFavorita: boolean = false;

  /** ID del usuario logueado */
  idUsuarioLogueado: number = 1;

  reproducirRadio: boolean = false;
  tituloRadio: string = '';

  /**
   * @constructor
   * @param cancionService Servicio para manejar canciones
   * @param artistaService Servicio para manejar artistas
   * @param tokenService Servicio para obtener información del usuario
   * @param recomendacionesService Servicio para la radio y recomendaciones semanales.
   */
  constructor(
    private cancionService: CancionService,
    private artistaService: ArtistaService,
    private tokenService: TokenService,
    private recomendacionService: RecomendacionService
  ) {}

  /**
   * @method ngOnInit
   * @description Inicializa el componente cargando las canciones
   * y obteniendo el ID del usuario logueado.
   */
  ngOnInit(): void {
    this.cargarCanciones();
    this.idUsuarioLogueado = this.tokenService.getUserIdFromToken() ?? 0;
  }

  // ----------------------------
  // Gestión de canciones
  // ----------------------------

  /**
   * @method cargarCanciones
   * @description Obtiene la lista de canciones del backend
   */
  cargarCanciones() {
    this.cancionService.obtenerCancionesGeneral().subscribe({
      next: (lista) => (this.canciones = lista),
      error: (err) => console.error('Error cargando canciones', err),
    });
  }

  /**
   * @method onSeleccionarCancion
   * @description Selecciona una canción y actualiza la información de artista y favoritos
   * @param cancion Canción seleccionada
   */
  onSeleccionarCancion(cancion: CancionDto) {
    this.cancionActual = cancion;
    this.indiceActual = this.canciones.indexOf(cancion);

    if (cancion.idArtista) {
      this.artistaService.obtenerArtistaPorId(cancion.idArtista).subscribe({
        next: (resp) => (this.artistaActual = resp.mensaje),
        error: () => (this.artistaActual = null),
      });
    }

    // Verificar si está en favoritos
    this.cancionService.listarFavoritasUsuario(this.idUsuarioLogueado).subscribe({
      next: (favoritas) => (this.esFavorita = favoritas.some((fav) => fav.id === cancion.id)),
      error: () => (this.esFavorita = false),
    });

    // Configurar reproductor
    setTimeout(() => {
      this.audioPlayer = document.getElementById('player-audio') as HTMLAudioElement;
      this.audioPlayer.ontimeupdate = () => this.actualizarProgreso();
      this.audioPlayer.onloadedmetadata = () => this.duracionMetadata();
      this.audioPlayer.play();
      this.reproduciendo = true;
    }, 0);
  }

  // ----------------------------
  // Gestión de favoritos
  // ----------------------------

  /**
   * @method toggleFavorito
   * @description Agrega o quita la canción actual de favoritos
   */
  toggleFavorito() {
    if (!this.cancionActual) return;

    if (this.esFavorita) {
      this.cancionService.quitarFavorita(this.idUsuarioLogueado, this.cancionActual.id!).subscribe({
        next: () => (this.esFavorita = false),
        error: (err) => console.error('Error quitando favorito', err),
      });
    } else {
      this.cancionService
        .agregarFavorita(this.idUsuarioLogueado, this.cancionActual.id!)
        .subscribe({
          next: () => (this.esFavorita = true),
          error: (err) => console.error('Error agregando favorito', err),
        });
    }
  }

  // ----------------------------
  // Reproducción
  // ----------------------------

  /**
   * @method togglePlay
   * @description Pausa o reproduce la canción actual
   */
  togglePlay() {
    if (!this.audioPlayer) return;

    if (this.reproduciendo) {
      this.audioPlayer.pause();
      this.reproduciendo = false;
    } else {
      this.audioPlayer.play();
      this.reproduciendo = true;
    }
  }

  /**
   * @method actualizarProgreso
   * @description Actualiza el tiempo y progreso de la canción
   */
  actualizarProgreso() {
    if (!this.audioPlayer) return;

    const actual = this.audioPlayer.currentTime;
    const total = this.audioPlayer.duration;

    this.progreso = (actual / total) * 100;
    this.tiempoActual = this.formatoTiempo(actual);
  }

  /**
   * @method duracionMetadata
   * @description Establece la duración total cuando cargan los metadatos
   */
  duracionMetadata() {
    if (!this.audioPlayer) return;
    this.duracionTotal = this.formatoTiempo(this.audioPlayer.duration);
  }

  /**
   * @method cambiarTiempo
   * @description Cambia el tiempo de reproducción al mover el slider
   * @param event Evento del input range
   */
  cambiarTiempo(event: any) {
    const porcentaje = event.target.value;
    const nuevoTiempo = (porcentaje / 100) * this.audioPlayer.duration;
    this.audioPlayer.currentTime = nuevoTiempo;
  }

  /**
   * @method siguienteCancion
   * @description Reproduce la siguiente canción en la lista
   */
  siguienteCancion() {
    if (!this.canciones || this.canciones.length === 0) return; // <-- protección

    if (this.indiceActual >= this.canciones.length - 1) {
      this.onSeleccionarCancion(this.canciones[0]);
    } else {
      this.onSeleccionarCancion(this.canciones[this.indiceActual + 1]);
    }
  }

  /**
   * @method anteriorCancion
   * @description Reproduce la canción anterior en la lista
   */
  anteriorCancion() {
    if (!this.canciones || this.canciones.length === 0) return;

    if (this.indiceActual <= 0) {
      this.onSeleccionarCancion(this.canciones[this.canciones.length - 1]);
    } else {
      this.onSeleccionarCancion(this.canciones[this.indiceActual - 1]);
    }
  }

  /**
   * @method formatoTiempo
   * @description Formatea segundos a mm:ss
   * @param segundos Número de segundos
   * @returns String en formato mm:ss
   */
  formatoTiempo(segundos: number): string {
    const min = Math.floor(segundos / 60);
    const sec = Math.floor(segundos % 60)
      .toString()
      .padStart(2, '0');
    return `${min}:${sec}`;
  }

  /**
   * @method cambiarVolumen
   * @description Cambia el volumen del reproductor
   * @param event Evento del input range
   */
  cambiarVolumen(event: any) {
    const volumen = Number(event.target.value);
    if (this.audioPlayer) {
      this.audioPlayer.volume = volumen;
    }
  }

  // ----------------------------
  // RADIO
  // ----------------------------

  /**
   * @method iniciarRadio
   * @description Inicia la radio basada en la canción actual
   */
  iniciarRadio() {
    if (!this.cancionActual) return;

    const cancionBase = this.cancionActual; // 🔹 guardar la canción que inicia la radio
    const idCancion = cancionBase.id!;

    this.recomendacionService.iniciarRadio(idCancion).subscribe({
      next: (radioDto) => {
        if (radioDto && radioDto.colaReproduccion?.length) {
          this.canciones = radioDto.colaReproduccion; // reemplaza la lista con la radio
          this.indiceActual = 0;
          this.onSeleccionarCancion(this.canciones[0]);

          this.reproducirRadio = true;
          this.tituloRadio = `Radio ${cancionBase.titulo}`;
        }
      },
      error: (err) => console.error('Error iniciando radio', err),
    });
  }
}
