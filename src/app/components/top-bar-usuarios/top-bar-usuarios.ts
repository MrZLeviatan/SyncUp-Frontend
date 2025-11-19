import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../core/auth/services/token.services';
import { LogoutService } from '../../core/auth/services/logout.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioDto } from '../../core/models/dto/usuario/usuario.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-bar-usuarios',
  templateUrl: './top-bar-usuarios.html',
  styleUrls: ['./top-bar-usuarios.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TopBarUsuarios implements OnInit {
  username: string = 'Usuario';
  usuario: UsuarioDto | null = null;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private logoutService: LogoutService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.username = this.tokenService.getUsername() || 'Usuario';

    // Obtener usuario completo por username
    this.usuarioService.obtenerUsuarioPorUsername(this.username).subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Error al cargar usuario', err);
      },
    });
  }

  goToCanciones() {
    this.router.navigate(['/usuario/menu-principal']);
  }

  goToPerfil() {
    this.router.navigate(['/usuario/perfil']);
  }

  cerrarSesion() {
    this.logoutService.logout();
  }
}
