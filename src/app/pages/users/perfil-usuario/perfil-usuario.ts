import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TokenService } from '../../../core/auth/services/token.services';
import { UsuarioDto } from '../../../core/models/dto/usuario/usuario.dto';
import { UsuarioService } from '../../../core/services/usuario/usuario.service';
import { ToastService } from '../../../components/toast/toast.service';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css',
})
export class PerfilUsuario implements OnInit {
  usuario: UsuarioDto | null = null;

  mostrarEditarNombre = false;
  mostrarEditarPassword = false;

  nombreActualizado: string = '';
  passwordAnterior: string = '';
  nuevoPassword: string = '';

  constructor(
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    const id = this.tokenService.getUserIdFromToken();
    if (!id) return;

    this.usuarioService.obtenerUsuarioPorId(id).subscribe({
      next: (r) => {
        this.usuario = r;
        this.nombreActualizado = this.usuario.nombre;
        this.toast.show('Datos del usuario cargados correctamente', 'success');
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
}
