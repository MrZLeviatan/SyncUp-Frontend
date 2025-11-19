import { Component, OnInit } from '@angular/core';
import { ListaCanciones } from '../../../components/lista-canciones/lista-canciones';
import { CancionDto } from '../../../core/models/dto/cancion/cancion.dto';
import { CommonModule } from '@angular/common';
import { GeneroMusical } from '../../../core/models/enum/genero-musical.enum';
import { FormsModule } from '@angular/forms';
import { ArtistaService } from '../../../core/services/artista.service';
import { RegistrarArtistasDto } from '../../../core/models/dto/artista/registrar-artista.dto';
import { ToastService } from '../../../layouts/public/avisos/toast.service';
import { RegistrarCancionDto } from '../../../core/models/dto/cancion/registrar-cancion.dto';
import { EditarCancionDto } from '../../../core/models/dto/cancion/editar-cancion.dto';
import { CancionService } from '../../../core/services/cancion.service';

@Component({
  selector: 'app-canciones-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ListaCanciones],
  templateUrl: './canciones-admin.html',
  styleUrls: ['./canciones-admin.css'],
})
export class CancionesAdminComponent implements OnInit {
  mostrarPanel: 'artista' | 'album' | 'cancion' = 'artista';

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

  /** Validar campos */
  titulo: string = '';
  genero: string = '';
  fecha: string = '';

  /** Guarda el ID del artista elegido */
  artistaSeleccionadoId: number | null = null;

  /** Indica si el área drag & drop está activa */
  isDragOver: boolean = false;

  /** Archivo de imagen arrastrado */
  archivoImagen: File | null = null;

  /** Proceso de carga al actualizar / guardar una canción */
  cargando: boolean = false;

  // Indica si estamos editando una canción existente
  editarMode: boolean = false;

  // Canción seleccioanda de la lista
  cancionSeleccionada?: CancionDto;

  // =======================================================
  // Sección Artista
  // =======================================================

  previewImagenArtista: string | null = null;
  imagenArchivoArtista: File | null = null;
  isDragOverArtista: boolean = false;
  nuevoArtista: RegistrarArtistasDto & { miembrosString?: string } = { nombreArtistico: '' };

  listaArtistasCollage: any[] = [];

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
    this.cargarArtistasCollage();
  }

  // =======================================================
  // Sección Artista
  // =======================================================

  onDragOverArtista(event: DragEvent) {
    event.preventDefault();
    this.isDragOverArtista = true;
  }
  onDragLeaveArtista(event: DragEvent) {
    event.preventDefault();
    this.isDragOverArtista = false;
  }
  onDropImagenArtista(event: DragEvent) {
    event.preventDefault();
    this.isDragOverArtista = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.cargarPreviewImagenArtista(file);
  }
  onImagenSeleccionadaArtista(event: any) {
    const file = event.target.files[0];
    if (file) this.cargarPreviewImagenArtista(file);
  }
  cargarPreviewImagenArtista(file: File) {
    this.imagenArchivoArtista = file;
    const reader = new FileReader();
    reader.onload = () => (this.previewImagenArtista = reader.result as string);
    reader.readAsDataURL(file);
  }
  eliminarImagenArtista() {
    this.previewImagenArtista = null;
    this.imagenArchivoArtista = null;
  }

  // Convertir miembrosString a array antes de enviar
  registrarArtista() {
    if (!this.nuevoArtista.nombreArtistico.trim()) return;

    const dto: RegistrarArtistasDto = {
      nombreArtistico: this.nuevoArtista.nombreArtistico,
      descripcion: this.nuevoArtista.descripcion,
      miembros: this.nuevoArtista.miembrosString?.split(',').map((m) => m.trim()),
      imagenPortada: this.imagenArchivoArtista ?? undefined,
    };

    // Validar que la imagen esté seleccionada
    if (!this.imagenArchivoArtista) {
      this.toastService.show('Selecciona una imagen de portada para el artista', 'error');
      return;
    }

    this.artistaService.registrarArtista(dto).subscribe({
      next: () => {
        this.toastService.show('Artista registrado correctamente', 'success');
        this.cancelarFormularioArtista();
        this.cargarArtistasCollage();
      },
      error: (err) => console.error(err),
    });
  }

  cancelarFormularioArtista() {
    this.nuevoArtista = { nombreArtistico: '' };
    this.nuevoArtista.miembrosString = '';
    this.previewImagenArtista = null;
    this.imagenArchivoArtista = null;
  }

  cargarArtistasCollage() {
    this.artistaService.listarArtistas().subscribe({
      next: (res) => {
        this.listaArtistasCollage = res.mensaje.map((a: any) => ({
          nombreArtistico: a.nombreArtistico,
          urlImagen: a.urlImagen,
        }));
      },
      error: (err) => {
        console.error('Error cargando artistas para collage', err);
      },
    });
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
      },
      error: (err) => console.error(err),
    });
  }

  /**
   * Recibe una canción seleccionada desde el componente hijo.
   * @param cancion Canción seleccionada
   */
  recibirCancionSeleccionada(cancion: CancionDto) {
    this.cancionSeleccionada = cancion; // Guardamos referencia

    // Activar modo edición
    this.editarMode = true;
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
          this.titulo = cancion.titulo;
          this.genero = cancion.generoMusical;
          this.fecha = cancion.fechaLanzamiento;
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
    this.editarMode = false; // desbloquear campos
    this.cancionSeleccionada = undefined;
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

  // ACTUALIZA LA CANCIÓN MEDIANTE LA SELECCIÓN DE ESTA EN LA TABLA.
  actualizarCancion(form: any) {
    if (!form.valid) {
      this.toastService.show('Completa todos los campos obligatorios', 'error');
      return;
    }
    if (!this.artistaSeleccionadoId) {
      this.toastService.show('Debes seleccionar un artista válido', 'error');
      return;
    }

    // Construir DTO de edición
    const dto: EditarCancionDto = {
      id: this.cancionSeleccionada?.id!, // ID de la canción seleccionada
      titulo: form.value.titulo,
      fechaLanzamiento: form.value.fecha,
      // Puedes agregar más campos si deseas
    };

    this.cargando = true;

    this.cancionService.actualizarCancion(dto).subscribe({
      next: () => {
        this.toastService.show('Canción actualizada correctamente', 'success');
        this.cargando = false;
        this.cancelarFormulario(); // Resetea formulario y vuelve al botón de guardar
        this.cargarCancionesGenerales(); // Refresca lista
      },
      error: (err) => {
        this.cargando = false;
        console.error(err);
        this.toastService.show('Error al actualizar la canción', 'error');
      },
    });
  }

  descargarCancionesTxt() {
    this.cancionService.descargarReporteGeneralCanciones().subscribe({
      next: (blob) => {
        // Llama a la función auxiliar del servicio para iniciar descarga
        this.cancionService.descargarArchivo(blob, 'canciones.txt');
      },
      error: (err) => {
        console.error('Error descargando el archivo', err);
        this.toastService.show('Error al descargar el archivo', 'error');
      },
    });
  }

  /**
   * Elimina la canción que está actualmente seleccionada.
   */
  eliminarCancionSeleccionada() {
    if (!this.cancionSeleccionada) return;

    const id = this.cancionSeleccionada.id;

    this.cancionService.eliminarCancion(id).subscribe({
      next: () => {
        this.toastService.show('Canción eliminada correctamente', 'success');
        this.cancelarFormulario(); // Resetea todo y vuelve al botón de descargar
        this.cargarCancionesGenerales(); // Refresca lista de canciones
      },
      error: (err) => {
        console.error(err);
        this.toastService.show('Error al eliminar la canción', 'error');
      },
    });
  }
}
