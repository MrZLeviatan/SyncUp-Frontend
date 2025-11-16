import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioDto } from '../../core/models/dto/usuario/usuario.dto';

/**
 * Componente encargado de mostrar una lista de usuarios en una tabla con scroll.
 */
@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-usuarios.html',
  styleUrls: ['./lista-usuarios.css'],
})
export class ListaUsuarios implements OnInit, OnChanges {
  /** Altura recibida desde el componente padre para ajustar el área de scroll. */
  @Input() alturaLista: number = 300;

  /** Lista de usuarios recibida desde el componente padre. */
  @Input() usuarios: UsuarioDto[] = [];

  usuariosFiltrados: UsuarioDto[] = [];

  /** Copia local de usuarios para refrescar la tabla cuando cambian los inputs. */
  usuariosGenerales: UsuarioDto[] = [];

  /** Emite el usuario seleccionado cuando se hace clic en una fila. */
  @Output() usuarioSeleccionado = new EventEmitter<UsuarioDto>();

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    const cambioUsuarios = changes['usuarios'];

    if (cambioUsuarios && Array.isArray(cambioUsuarios.currentValue)) {
      this.usuariosFiltrados = [...cambioUsuarios.currentValue];
      this.usuariosGenerales = [...cambioUsuarios.currentValue];
    } else {
      this.usuariosFiltrados = [];
      this.usuariosGenerales = [];
    }
  }

  /** Emite el usuario seleccionado al componente padre. */
  seleccionarUsuario(usuario: UsuarioDto) {
    this.usuarioSeleccionado.emit(usuario);
  }
}
