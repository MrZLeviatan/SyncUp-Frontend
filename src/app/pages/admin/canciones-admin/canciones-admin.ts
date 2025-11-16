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
import { ToastService } from '../../../components/toast/toast.service';
import { RegistrarCancionDto } from '../../../core/models/dto/cancion/registrar-cancion.dto';

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

  /** Guarda el ID del artista elegido */
  artistaSeleccionadoId: number | null = null;

  /** Indica si el área drag & drop está activa */
  isDragOver: boolean = false;

  /** Archivo de imagen arrastrado */
  archivoImagen: File | null = null;

  /** Proceso de carga al actualizar / guardar una canción */
  cargando: boolean = false;

  // =======================================================
  // CONSTRUCTOR + ONINIT
  // =======================================================

  constructor(
    private cancionService: CancionService,
    private artistaService: ArtistaService,
    private toastService: ToastService
  ) {}

  /**
   * Inicializa el componente cargando la lista general de canciones.
   */
  ngOnInit(): void {
    this.cargarCancionesGenerales();
  }

  // =======================================================
  // CARGAR CANCIONES
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

    // ============================
    // 1. TÍTULO
    // ============================
    const inputTitulo = document.querySelector('input[name="titulo"]') as HTMLInputElement;
    if (inputTitulo) inputTitulo.value = cancion.titulo;

    // ============================
    // 2. ARTISTA
    // ============================
    if (cancion.idArtista) {
      this.artistaService.obtenerArtistaPorId(cancion.idArtista).subscribe({
        next: (res) => {
          const artista = res.mensaje;

          this.textoArtista = artista.nombreArtistico;
          this.artistaSeleccionadoId = artista.id;

          console.log('Artista cargado:', artista);
        },
        error: (err) => {
          console.error('Error obteniendo artista:', err);
          this.toastService.show('No se pudo cargar la información del artista', 'error');
        },
      });
    }

    // ============================
    // 3. GÉNERO
    // ============================
    const selectGenero = document.querySelector('select[name="genero"]') as HTMLSelectElement;
    if (selectGenero) selectGenero.value = cancion.generoMusical;

    // ============================
    // 4. FECHA DE LANZAMIENTO
    // ============================
    const inputFecha = document.querySelector('input[name="fecha"]') as HTMLInputElement;
    if (inputFecha) inputFecha.value = cancion.fechaLanzamiento;

    // ============================
    // 5. IMAGEN (desde Cloudinary)
    // ============================
    if (cancion.urlPortada) {
      this.previewImagen = cancion.urlPortada;
      this.archivoImagen = null; // porque viene por URL
    }

    // ============================
    // 6. AUDIO MP3 (desde Cloudinary)
    // ============================
    if (cancion.urlCancion) {
      this.audioURL = cancion.urlCancion;
      this.audioArchivo = null;
    }
  }

  // =======================================================
  // MANEJO DE AUDIO
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
  // MANEJO DE IMAGEN (DRAG & DROP + FILE)
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
  // FORMULARIO: LIMPIEZA Y RESET
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
  // AUTOCOMPLETAR ARTISTAS
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
    this.artistaSeleccionadoId = artista.id; // Guardamos el ID real
    this.listaArtistas = [];
  }

  // =======================================================
  //  MODAL PARA REGISTRAR ARTISTA
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
        this.toastService.show('Artista registrado correctamente', 'success');
        this.cerrarModalArtista();
      },
      error: (err) => console.error(err),
    });
  }

  // =======================================================
  //  REGISTRO DE CANCIONES
  // =======================================================

  guardarCancion(form: any) {
    // VALIDAR FORMULARIO COMPLETO
    if (!form.valid) {
      this.toastService.show('Completa todos los campos del formulario', 'error');
      return;
    }
    if (!this.archivoImagen) {
      this.toastService.show('Debes seleccionar una imagen de portada', 'error');
      return;
    }
    if (!this.audioArchivo) {
      this.toastService.show('Debes seleccionar un archivo MP3', 'error');
      return;
    }
    if (!this.artistaSeleccionadoId) {
      this.toastService.show('Debes seleccionar un artista válido', 'error');
      return;
    }

    // ARMAR DTO COMPLETO
    const dto: RegistrarCancionDto = {
      titulo: form.value.titulo,
      generoMusical: form.value.genero,
      fechaLanzamiento: form.value.fecha,
      archivoCancion: this.audioArchivo,
      imagenPortada: this.archivoImagen,
      artistaId: this.artistaSeleccionadoId,
    };

    this.cargando = true; // Activar spinner

    // LLAMADA AL SERVICIO
    this.cancionService.registrarCancion(dto).subscribe({
      next: () => {
        this.toastService.show('Canción registrada correctamente', 'success');
        this.cargando = false;
        this.cancelarFormulario();
        this.cargarCancionesGenerales();
      },
    });
  }
}
