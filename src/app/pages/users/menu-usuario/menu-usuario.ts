// 🇪🇸 Reproductor estilo Spotify funcional
// 🇺🇸 Fully working Spotify-like audio player

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancionDto } from '../../../core/models/dto/cancion/cancion.dto';
import { ListaCanciones } from '../../../components/lista-canciones/lista-canciones';
import { CancionService } from '../../../core/services/canciones/cancion.service';
import { ArtistaDto } from '../../../core/models/dto/artista/artista.dto';
import { ArtistaService } from '../../../core/services/artista.service';
import { TokenService } from '../../../core/auth/services/token.services';

@Component({
  selector: 'app-menu-usuario',
  standalone: true,
  imports: [CommonModule, ListaCanciones],
  templateUrl: './menu-usuario.html',
  styleUrls: ['./menu-usuario.css'],
})
export class MenuUsuario implements OnInit {
  canciones: CancionDto[] = [];
  cancionActual: CancionDto | null = null;
  artistaActual: ArtistaDto | null = null;

  audioPlayer!: HTMLAudioElement;

  // 🇪🇸 Control del tiempo / 🇺🇸 Time controls
  tiempoActual: string = '0:00';
  duracionTotal: string = '0:00';
  progreso: number = 0;

  // 🇪🇸 Índice actual en la lista / 🇺🇸 Current index in the list
  indiceActual: number = -1;

  // 🇪🇸 Estado de reproducción / 🇺🇸 Playing state
  reproduciendo: boolean = false;

  esFavorita: boolean = false;

  idUsuarioLogueado: number = 1;

  constructor(
    private cancionService: CancionService,
    private artistaService: ArtistaService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.cargarCanciones();
    this.idUsuarioLogueado = this.tokenService.getUserIdFromToken() ?? 0;
  }

  cargarCanciones() {
    this.cancionService.obtenerCancionesGeneral().subscribe({
      next: (lista) => {
        this.canciones = lista;
      },
      error: (err) => console.error('Error cargando canciones', err),
    });
  }

  // Cada vez que seleccionas canción, verificamos si es favorita
  onSeleccionarCancion(cancion: CancionDto) {
    this.cancionActual = cancion;
    this.indiceActual = this.canciones.indexOf(cancion);

    if (cancion.idArtista) {
      this.artistaService.obtenerArtistaPorId(cancion.idArtista).subscribe({
        next: (resp) => (this.artistaActual = resp.mensaje),
        error: () => (this.artistaActual = null),
      });
    }

    // 🔹 Verificar si la canción está en favoritos
    this.cancionService.listarFavoritasUsuario(this.idUsuarioLogueado).subscribe({
      next: (favoritas) => {
        this.esFavorita = favoritas.some((fav) => fav.id === cancion.id);
      },
      error: () => (this.esFavorita = false),
    });

    setTimeout(() => {
      this.audioPlayer = document.getElementById('player-audio') as HTMLAudioElement;
      this.audioPlayer.ontimeupdate = () => this.actualizarProgreso();
      this.audioPlayer.onloadedmetadata = () => this.duracionMetadata();
      this.audioPlayer.play();
      this.reproduciendo = true;
    }, 0);
  }

  // 🔹 Toggle favorito
  toggleFavorito() {
    if (!this.cancionActual) return;

    if (this.esFavorita) {
      // Quitar de favoritos
      this.cancionService.quitarFavorita(this.idUsuarioLogueado, this.cancionActual.id!).subscribe({
        next: () => (this.esFavorita = false),
        error: (err) => console.error('Error quitando favorito', err),
      });
    } else {
      // Agregar a favoritos
      this.cancionService
        .agregarFavorita(this.idUsuarioLogueado, this.cancionActual.id!)
        .subscribe({
          next: () => (this.esFavorita = true),
          error: (err) => console.error('Error agregando favorito', err),
        });
    }
  }

  // 🇪🇸 Play / Pause / 🇺🇸 Play / Pause
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

  // 🇪🇸 Actualizar tiempo actual / 🇺🇸 Update current time
  actualizarProgreso() {
    if (!this.audioPlayer) return;

    const actual = this.audioPlayer.currentTime;
    const total = this.audioPlayer.duration;

    this.progreso = (actual / total) * 100;

    this.tiempoActual = this.formatoTiempo(actual);
  }

  // 🇪🇸 Cuando cargan los metadatos / 🇺🇸 When metadata loads
  duracionMetadata() {
    if (!this.audioPlayer) return;
    this.duracionTotal = this.formatoTiempo(this.audioPlayer.duration);
  }

  // 🇪🇸 Cambiar posición al mover el slider / 🇺🇸 Seek when slider moves
  cambiarTiempo(event: any) {
    const porcentaje = event.target.value;
    const nuevoTiempo = (porcentaje / 100) * this.audioPlayer.duration;
    this.audioPlayer.currentTime = nuevoTiempo;
  }

  // 🇪🇸 Siguiente canción / 🇺🇸 Next song
  siguienteCancion() {
    if (this.indiceActual < this.canciones.length - 1) {
      this.onSeleccionarCancion(this.canciones[this.indiceActual + 1]);
    }
  }

  // 🇪🇸 Canción anterior / 🇺🇸 Previous song
  anteriorCancion() {
    if (this.indiceActual > 0) {
      this.onSeleccionarCancion(this.canciones[this.indiceActual - 1]);
    }
  }

  // 🇪🇸 Formato mm:ss / 🇺🇸 Format mm:ss
  formatoTiempo(segundos: number): string {
    const min = Math.floor(segundos / 60);
    const sec = Math.floor(segundos % 60)
      .toString()
      .padStart(2, '0');
    return `${min}:${sec}`;
  }

  // 🇪🇸 Cambiar volumen / 🇺🇸 Change volume
  cambiarVolumen(event: any) {
    const volumen = Number(event.target.value);
    if (this.audioPlayer) {
      this.audioPlayer.volume = volumen;
    }
  }
}
