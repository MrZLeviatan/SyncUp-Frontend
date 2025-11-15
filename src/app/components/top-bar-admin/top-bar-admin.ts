import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../core/auth/services/token.services';
import { LogoutService } from '../../core/auth/services/logout.service';

@Component({
  selector: 'app-top-bar-admin',
  templateUrl: './top-bar-admin.html',
  styleUrls: ['./top-bar-admin.css'],
})
export class TopBarAdmin {
  username: string; // Nombre de usuario mostrado en la barra

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private logoutService: LogoutService
  ) {
    // Obtener el nombre de usuario desde el servicio de token o usar 'Admin' por defecto
    this.username = this.tokenService.getUsername() || 'Admin';
  }

  // Navegar a la sección de gestión de canciones
  goToCanciones() {
    this.router.navigate(['/admin/canciones']);
  }

  // Navegar a la sección de gestión de usuarios
  goToUsuarios() {
    this.router.navigate(['/admin/usuarios']);
  }

  // Cerrar sesión usando el servicio de logout
  cerrarSesion() {
    this.logoutService.logout();
  }
}
