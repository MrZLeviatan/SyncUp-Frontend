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

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ListaCanciones],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css',
})
export class PerfilUsuario implements OnInit {
  usuario: UsuarioDto | null = null;
  cancionesFavoritas: CancionDto[] = [];
  idUsuarioLogueado: number | null = null;

  mostrarEditarNombre = false;
  mostrarEditarPassword = false;

  nombreActualizado: string = '';
  passwordAnterior: string = '';
  nuevoPassword: string = '';

  cancionSeleccionada: CancionDto | null = null;

  artistaSeleccionado: ArtistaDto | null = null;

  constructor(
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private toast: ToastService,
    private cancionService: CancionService,
    private cancionArchivoService: CancionArchivoService,
    private artistaService: ArtistaService
  ) {}

  ngOnInit(): void {
    this.idUsuarioLogueado = this.tokenService.getUserIdFromToken();
    this.cargarDatosUsuario();
    this.cargarCancionesFavoritas();
  }

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

  actualizarNombre(): void {
    if (!this.usuario) return;

    // ❗ Validación: campo vacío
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

  actualizarPassword(): void {
    if (!this.usuario) return;

    // ❗ Validación: campos vacíos
    if (!this.passwordAnterior || this.passwordAnterior.trim().length === 0) {
      this.toast.show('Debe ingresar su contraseña actual', 'error');
      return;
    }

    if (!this.nuevoPassword || this.nuevoPassword.trim().length === 0) {
      this.toast.show('Debe ingresar la nueva contraseña', 'error');
      return;
    }

    // ❗ Regla opcional: nueva contraseña mínima de 6 caracteres
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

  cargarCancionesFavoritas(): void {
    if (!this.idUsuarioLogueado) return;

    this.cancionService.listarFavoritasUsuario(this.idUsuarioLogueado).subscribe({
      next: (lista) => {
        this.cancionesFavoritas = lista;
        console.log(this.cancionesFavoritas);
      },
      error: () => {
        this.toast.show('Error cargando canciones favoritas', 'error');
      },
    });
  }

  // Cuando se selecciona una canción en la lista
  onSeleccionarCancion(cancion: CancionDto) {
    this.cancionSeleccionada = cancion;
    this.artistaSeleccionado = null; // Limpiar artista previo

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

  // Descargar CSV de favoritas
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

  // Quitar canción seleccionada de favoritas
  quitarCancionFavorita(): void {
    if (!this.idUsuarioLogueado || !this.cancionSeleccionada) return;

    this.cancionService
      .quitarFavorita(this.idUsuarioLogueado, this.cancionSeleccionada.id)
      .subscribe({
        next: () => {
          this.toast.show('Canción eliminada de favoritas', 'success');
          // Actualizar lista eliminando la canción
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
}
