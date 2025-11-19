import { Component, OnInit } from '@angular/core';
import { UsuarioDto } from '../../../core/models/dto/usuario/usuario.dto';
import { ListaUsuarios } from '../../../components/lista-usuarios/lista-usuarios';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [ListaUsuarios, CommonModule],
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css',
})
export class GestionUsuarios implements OnInit {
  /** Lista de usuarios obtenida desde el backend */
  listaUsuarios: UsuarioDto[] = [];

  /** Usuario seleccionado proveniente del componente hijo */
  usuarioSeleccionadoPadre: UsuarioDto | null = null;

  constructor(private usuarioService: UsuarioService) {}

  /** Método que se ejecuta al iniciar el componente */
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  /** Obtiene la lista completa de usuarios usando el servicio y la asigna al arreglo */
  cargarUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.listaUsuarios = usuarios; // Asignar lista recibida
      },
      error: (error) => {
        console.error('Error cargando usuarios', error); // Error al cargar
      },
    });
  }

  /** Método que se activa cuando el componente hijo selecciona un usuario */
  mostrarDetalles(usuario: UsuarioDto) {
    this.usuarioSeleccionadoPadre = usuario; // Guardar usuario seleccionado
  }

  /** Elimina el usuario seleccionado llamando al backend y actualiza la lista */
  eliminarUsuarioSeleccionado() {
    if (!this.usuarioSeleccionadoPadre) return; // Validación

    const user = this.usuarioSeleccionadoPadre;

    this.usuarioService.eliminarUsuario(user.id).subscribe({
      next: () => {
        // Remover de la lista filtrando por id
        this.listaUsuarios = this.listaUsuarios.filter((u) => u.id !== user.id);

        // Limpiar selección
        this.usuarioSeleccionadoPadre = null;

        console.log('Usuario eliminado:', user);
      },
      error: (err) => {
        console.error('Error eliminando usuario', err); // Error al eliminar
      },
    });
  }
}
