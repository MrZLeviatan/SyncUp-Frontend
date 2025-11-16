import { CancionBusquedaService } from './../../../core/services/canciones/cancion-busqueda.service';
import { Component, OnInit } from '@angular/core';
import { ListaCanciones } from '../../../components/lista-canciones/lista-canciones';
import { CancionDto } from '../../../core/models/dto/cancion/cancion.dto';
import { CancionService } from '../../../core/services/canciones/cancion.service';
import { CommonModule } from '@angular/common';
import { GeneroMusical } from '../../../core/models/enum/genero-musical.enum';
import { FormsModule } from '@angular/forms';
import { ArtistaService } from '../../../core/services/artista.service';
import { RegistrarArtistasDto } from '../../../core/models/dto/artista/registrar-artista.dto';

@Component({
  selector: 'app-canciones-admin',
  standalone: true,
  imports: [ListaCanciones, CommonModule, FormsModule],
  templateUrl: './canciones-admin.html',
  styleUrls: ['./canciones-admin.css'],
})
export class CancionesAdminComponent implements OnInit {
  /** Lista general de canciones cargadas desde backend */
  canciones: CancionDto[] = [];

  /** Altura del componente lista de canciones */
  alturaLista = 450;

  /** Vista previa de la imagen cargada */
  previewImagen: string | null = null;

  /** Archivo de imagen seleccionado o arrastrado */
  imagenArchivo!: File;

  /** URL temporal para reproducir el audio seleccionado */
  audioURL: string | null = null;

  /** Archivo de audio seleccionado */
  audioArchivo: File | null = null;

  /** Lista de artistas obtenidos al autocompletar */
  listaArtistas: any[] = [];

  /** Texto del campo de búsqueda de artista */
  textoArtista: string = '';

  /** Lista de géneros disponibles */
  generos = Object.values(GeneroMusical);

  /** Controla el estado del modal para registrar artista */
  mostrarModalArtista: boolean = false;

  /** DTO temporal para registrar un artista */
  nuevoArtista: RegistrarArtistasDto = {
    nombreArtistico: '',
  };

  /** Indica si el área drag & drop está activa */
  isDragOver: boolean = false;

  /** Archivo de imagen arrastrado */
  archivoImagen: File | null = null;

  // =======================================================
  // 🟦 CONSTRUCTOR + ONINIT
  // =======================================================

  constructor(
    private cancionService: CancionService,
    private cancionBusquedaService: CancionBusquedaService,
    private artistaService: ArtistaService
  ) {}

  /**
   * Inicializa el componente cargando la lista general de canciones.
   */
  ngOnInit(): void {
    this.cargarCancionesGenerales();
  }

  // =======================================================
  // 🟩 CARGAR CANCIONES
  // =======================================================

  /**
   * Obtiene todas las canciones desde el backend.
   */
  cargarCancionesGenerales() {
    this.cancionService.obtenerCancionesGeneral().subscribe({
      next: (res) => {
        this.canciones = res;
        console.log(this.canciones);
      },
      error: (err) => console.error(err),
    });
  }

  /**
   * Recibe una canción seleccionada desde el componente hijo.
   * @param cancion Canción seleccionada
   */
  recibirCancionSeleccionada(cancion: CancionDto) {
    console.log('Cancion seleccionada:', cancion);
  }

  // =======================================================
  // 🟧 MANEJO DE AUDIO
  // =======================================================

  /**
   * Maneja la selección del archivo MP3.
   * @param event Evento del input file
   */
  onAudioSeleccionado(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.audioArchivo = file;
    this.audioURL = URL.createObjectURL(file);
  }

  // =======================================================
  // 🟪 MANEJO DE IMAGEN (DRAG & DROP + FILE)
  // =======================================================

  /**
   * Activa el estado de arrastre sobre el área de drop.
   * @param event Evento DragEvent
   */
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  /**
   * Desactiva el estado de arrastre al salir del área.
   * @param event Evento DragEvent
   */
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  /**
   * Recibe el archivo cuando es soltado sobre el área.
   * @param event Evento DragEvent
   */
  onDropImagen(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.cargarPreviewImagen(file);
    }
  }

  /**
   * Maneja la selección de imagen desde el input file.
   * @param event Evento del input file
   */
  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];
    this.cargarPreviewImagen(file);
  }

  /**
   * Lee el archivo seleccionado y genera una vista previa.
   * @param file Archivo de imagen
   */
  cargarPreviewImagen(file: File) {
    this.archivoImagen = file;

    const reader = new FileReader();
    reader.onload = () => (this.previewImagen = reader.result as string);
    reader.readAsDataURL(file);
  }

  /**
   * Elimina la imagen seleccionada y su vista previa.
   */
  eliminarImagen() {
    this.previewImagen = null;
    this.archivoImagen = null;
  }

  // =======================================================
  // 🟥 FORMULARIO: LIMPIEZA Y RESET
  // =======================================================

  /**
   * Limpia todos los campos del formulario,
   * resetea inputs y elimina archivos cargados.
   */
  cancelarFormulario() {
    this.previewImagen = null;
    this.archivoImagen = null;

    this.audioURL = null;
    this.audioArchivo = null;

    const audioInput = document.querySelector(
      'input[type="file"][accept="audio/mp3"]'
    ) as HTMLInputElement;
    if (audioInput) audioInput.value = '';

    const imgInput = document.querySelector(
      'input[type="file"][accept="image/*"]'
    ) as HTMLInputElement;
    if (imgInput) imgInput.value = '';

    const form = document.querySelector('.formulario-cancion') as HTMLFormElement;
    if (form) form.reset();
  }

  // =======================================================
  // 🟨 AUTOCOMPLETAR ARTISTAS
  // =======================================================

  /**
   * Busca artistas a medida que se escribe en el input.
   * @param event Evento del input
   */
  buscarArtistas(event: any) {
    const texto = event.target.value.trim();
    this.textoArtista = texto;

    if (texto.length < 1) {
      this.listaArtistas = [];
      return;
    }

    this.artistaService.autocompletarArtistas(texto).subscribe({
      next: (res) => {
        this.listaArtistas = res?.mensaje || [];
      },
      error: (err) => console.error(err),
    });
  }

  /**
   * Selecciona un artista de la lista de sugerencias.
   * @param artista Artista elegido
   */
  seleccionarArtista(artista: any) {
    this.textoArtista = artista.nombreArtistico;
    this.listaArtistas = [];
  }

  // =======================================================
  // 🟦 MODAL PARA REGISTRAR ARTISTA
  // =======================================================

  /** Abre el modal para registro de artista */
  abrirModalArtista() {
    this.mostrarModalArtista = true;
  }

  /** Cierra el modal y resetea el formulario */
  cerrarModalArtista() {
    this.mostrarModalArtista = false;
    this.nuevoArtista = { nombreArtistico: '' };
  }

  /**
   * Registra un nuevo artista usando el servicio.
   */
  registrarArtista() {
    if (!this.nuevoArtista.nombreArtistico.trim()) return;

    this.artistaService.registrarArtista(this.nuevoArtista).subscribe({
      next: (res) => {
        alert('Artista registrado correctamente');
        this.cerrarModalArtista();
      },
      error: (err) => console.error(err),
    });
  }
}
