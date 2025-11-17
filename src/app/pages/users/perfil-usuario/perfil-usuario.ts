import { CancionArchivoService } from './../../../core/services/canciones/cancion-archivo.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TokenService } from '../../../core/auth/services/token.services';
import { UsuarioDto } from '../../../core/models/dto/usuario/usuario.dto';
import { UsuarioService } from '../../../core/services/usuario/usuario.service';
import { ToastService } from '../../../components/toast/toast.service';
import { CancionDto } from '../../../core/models/dto/cancion/cancion.dto';
import { CancionService } from '../../../core/services/canciones/cancion.service';
import { ListaCanciones } from '../../../components/lista-canciones/lista-canciones';
import { ArtistaDto } from '../../../core/models/dto/artista/artista.dto';
import { ArtistaService } from '../../../core/services/artista.service';
import { ListaUsuarios } from '../../../components/lista-usuarios/lista-usuarios';
import { UsuarioSocialService } from '../../../core/services/usuario/usuario-social.service';
import { SugerenciaUsuariosDto } from '../../../core/models/dto/usuario/sugerencia-usuario.dto';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ListaCanciones, ListaUsuarios],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css',
})
export class PerfilUsuario implements OnInit {
  /** Datos generales del usuario autenticado */
  usuario: UsuarioDto | null = null;

  /** Lista de canciones favoritas del usuario */
  cancionesFavoritas: CancionDto[] = [];

  /** ID del usuario autenticado obtenido mediante JWT */
  idUsuarioLogueado: number | null = null;

  /** Controla la visualización del formulario de edición de nombre */
  mostrarEditarNombre = false;

  /** Controla el formulario de actualización de contraseña */
  mostrarEditarPassword = false;

  /** Modelo del nombre editable */
  nombreActualizado: string = '';

  /** Contraseña actual ingresada para validación */
  passwordAnterior: string = '';

  /** Nueva contraseña ingresada por el usuario */
  nuevoPassword: string = '';

  /** Lista de sugerencias de usuarios para seguir */
  sugerenciasAmigos: UsuarioDto[] = [];

  /** Lista de usuarios que el usuario actual ya sigue */
  misAmigos: UsuarioDto[] = [];

  /** Canción seleccionada por el usuario en la vista */
  cancionSeleccionada: CancionDto | null = null;

  /** Información del artista asociado a la canción seleccionada */
  artistaSeleccionado: ArtistaDto | null = null;

  /** Usuario seleccionado dentro de la lista de sugerencias */
  usuarioSugerenciaSeleccionado: UsuarioDto | null = null;

  /** Usuario seleccionado dentro de la lista de amigos */
  usuarioAmigoSeleccionado: UsuarioDto | null = null;

  constructor(
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private toast: ToastService,
    private cancionService: CancionService,
    private cancionArchivoService: CancionArchivoService,
    private artistaService: ArtistaService,
    private usuarioSocial: UsuarioSocialService
  ) {}

  /**
   * Inicializa el componente cargando:
   * - Datos del usuario autenticado.
   * - Canciones favoritas.
   * - Sugerencias de amigos.
   * - Lista de amigos actuales.
   */
  ngOnInit(): void {
    this.idUsuarioLogueado = this.tokenService.getUserIdFromToken();
    this.cargarDatosUsuario();
    this.cargarCancionesFavoritas();
    this.cargarSugerencias();
    this.cargarAmigos();
  }

  /**
   * Carga los datos del usuario autenticado utilizando el ID extraído del token.
   * Actualiza el modelo local del nombre del usuario.
   */
  cargarDatosUsuario(): void {
    const id = this.tokenService.getUserIdFromToken();
    if (!id) return;

    this.usuarioService.obtenerUsuarioPorId(id).subscribe({
      next: (r) => {
        this.usuario = r;
        this.nombreActualizado = this.usuario.nombre;
      },
      error: () => {
        this.toast.show('Error cargando los datos del usuario', 'error');
      },
    });
  }

  /**
   * Actualiza el nombre del usuario en el backend.
   * Incluye validaciones y muestra mensajes de feedback.
   */
  actualizarNombre(): void {
    if (!this.usuario) return;

    if (!this.nombreActualizado || this.nombreActualizado.trim().length === 0) {
      this.toast.show('Debe ingresar un nombre para continuar', 'error');
      return;
    }

    const dto = { id: this.usuario.id, nombre: this.nombreActualizado };

    this.usuarioService.editarUsuario(dto).subscribe({
      next: () => {
        this.usuario!.nombre = this.nombreActualizado;
        this.mostrarEditarNombre = false;
        this.toast.show('Nombre actualizado correctamente', 'success');
      },
      error: () => {
        this.toast.show('Error actualizando el nombre', 'error');
      },
    });
  }

  /**
   * Actualiza la contraseña del usuario.
   * Valida campos vacíos y reglas básicas antes de enviar al backend.
   */
  actualizarPassword(): void {
    if (!this.usuario) return;

    if (!this.passwordAnterior || this.passwordAnterior.trim().length === 0) {
      this.toast.show('Debe ingresar su contraseña actual', 'error');
      return;
    }

    if (!this.nuevoPassword || this.nuevoPassword.trim().length === 0) {
      this.toast.show('Debe ingresar la nueva contraseña', 'error');
      return;
    }

    if (this.nuevoPassword.length < 6) {
      this.toast.show('La nueva contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    const dto = {
      id: this.usuario.id,
      passwordAnterior: this.passwordAnterior,
      nuevoPassword: this.nuevoPassword,
    };

    this.usuarioService.editarPassword(dto).subscribe({
      next: () => {
        this.passwordAnterior = '';
        this.nuevoPassword = '';
        this.mostrarEditarPassword = false;
        this.toast.show('Contraseña actualizada correctamente', 'success');
      },
      error: () => {
        this.toast.show('Error actualizando la contraseña', 'error');
      },
    });
  }

  /**
   * Carga las canciones favoritas del usuario autenticado.
   * Los datos serán mostrados en una lista del frontend.
   */
  cargarCancionesFavoritas(): void {
    if (!this.idUsuarioLogueado) return;

    this.cancionService.listarFavoritasUsuario(this.idUsuarioLogueado).subscribe({
      next: (lista) => {
        this.cancionesFavoritas = lista;
      },
      error: () => {
        this.toast.show('Error cargando canciones favoritas', 'error');
      },
    });
  }

  /**
   * Evento disparado al seleccionar una canción en la lista.
   * Carga dinámicamente los datos del artista asociado.
   */
  onSeleccionarCancion(cancion: CancionDto) {
    this.cancionSeleccionada = cancion;
    this.artistaSeleccionado = null;

    if (cancion.idArtista) {
      this.artistaService.obtenerArtistaPorId(cancion.idArtista).subscribe({
        next: (res) => {
          this.artistaSeleccionado = res.mensaje;
        },
        error: () => {
          this.toast.show('Error cargando información del artista', 'error');
        },
      });
    }
  }

  /**
   * Permite descargar un archivo CSV con las canciones favoritas del usuario.
   * Maneja creación dinámica del enlace HTML.
   */
  descargarCancionesCSV(): void {
    if (!this.idUsuarioLogueado) return;

    this.cancionArchivoService.descargarReporteFavoritos(this.idUsuarioLogueado).subscribe({
      next: (blob) => {
        const filename = 'canciones_favoritas.csv';
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.toast.show('Error descargando el CSV', 'error');
      },
    });
  }

  /**
   * Quita la canción seleccionada de la lista de favoritas.
   * Recarga dinámicamente el listado local.
   */
  quitarCancionFavorita(): void {
    if (!this.idUsuarioLogueado || !this.cancionSeleccionada) return;

    this.cancionService
      .quitarFavorita(this.idUsuarioLogueado, this.cancionSeleccionada.id)
      .subscribe({
        next: () => {
          this.toast.show('Canción eliminada de favoritas', 'success');
          this.cancionesFavoritas = this.cancionesFavoritas.filter(
            (c) => c.id !== this.cancionSeleccionada!.id
          );
          this.cancionSeleccionada = null;
        },
        error: () => {
          this.toast.show('Error eliminando la canción', 'error');
        },
      });
  }

  /**
   * Carga la lista de usuarios sugeridos para seguir al usuario actual.
   */
  cargarSugerencias() {
    if (!this.idUsuarioLogueado) return;
    this.usuarioSocial.obtenerSugerencias(this.idUsuarioLogueado).subscribe({
      next: (lista: UsuarioDto[]) => {
        this.sugerenciasAmigos = lista;
      },
      error: () => this.toast.show('Error cargando sugerencias', 'error'),
    });
  }

  /**
   * Carga los usuarios que el usuario actual sigue.
   */
  cargarAmigos() {
    if (!this.idUsuarioLogueado) return;
    this.usuarioSocial.obtenerUsuariosSeguidos(this.idUsuarioLogueado).subscribe({
      next: (lista: UsuarioDto[]) => {
        this.misAmigos = lista;
      },
      error: () => this.toast.show('Error cargando lista de seguidos', 'error'),
    });
  }

  /** Selecciona un usuario dentro de las sugerencias */
  onSeleccionarSugerencia(usuario: UsuarioDto) {
    this.usuarioSugerenciaSeleccionado = usuario;
  }

  /** Cancela la selección de usuario sugerido */
  cancelarSeleccionSugerencia() {
    this.usuarioSugerenciaSeleccionado = null;
  }

  /**
   * Confirma la acción de seguir a un usuario.
   * Actualiza las listas locales de sugerencias y amigos.
   */
  confirmarSeguir() {
    if (!this.idUsuarioLogueado || !this.usuarioSugerenciaSeleccionado) return;

    const dto = {
      idUsuarioPrincipal: this.idUsuarioLogueado,
      idUsuarioObjetivo: this.usuarioSugerenciaSeleccionado.id,
    };

    this.usuarioSocial.seguirUsuario(dto).subscribe({
      next: () => {
        this.toast.show('Has empezado a seguir al usuario', 'success');
        this.cargarSugerencias();
        this.cargarAmigos();
        this.usuarioSugerenciaSeleccionado = null;
      },
      error: () => {
        this.toast.show('Error al seguir al usuario', 'error');
      },
    });
  }

  /** Selecciona un usuario dentro de los amigos */
  onSeleccionarAmigo(usuario: UsuarioDto) {
    this.usuarioAmigoSeleccionado = usuario;
  }

  /** Cancela la selección de amigo */
  cancelarSeleccionAmigo() {
    this.usuarioAmigoSeleccionado = null;
  }

  /**
   * Confirma la acción de dejar de seguir un usuario.
   * Actualiza las listas locales de amigos y sugerencias.
   */
  confirmarDejarSeguir() {
    if (!this.idUsuarioLogueado || !this.usuarioAmigoSeleccionado) return;

    const dto = {
      idUsuarioPrincipal: this.idUsuarioLogueado,
      idUsuarioObjetivo: this.usuarioAmigoSeleccionado.id,
    };

    this.usuarioSocial.dejarDeSeguirUsuario(dto).subscribe({
      next: () => {
        this.toast.show('Has dejado de seguir al usuario', 'success');

        this.cargarAmigos();
        this.cargarSugerencias();

        this.usuarioAmigoSeleccionado = null;
      },
      error: () => {
        this.toast.show('Error al dejar de seguir al usuario', 'error');
      },
    });
  }
}
