import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../app.config';
import { RegistrarUsuarioDto } from '../models/dto/usuario/registrar-usuario.dto';
import { MensajeDto } from '../models/dto/mensaje.dto';
import { LoginDto } from '../models/dto/login.dto';
import { TokenDto } from '../models/dto/token.dto';

/**
 * @injectable
 * @description Servicio de Angular encargado de gestionar las operaciones de **Autenticación y Registro**
 * con la API del backend.
 *
 * Contiene los métodos para crear un nuevo usuario y para obtener un token de acceso (login).
 */
@Injectable({
  providedIn: 'root', // El servicio está disponible en toda la aplicación.
})
export class AuthService {
  // URL base del endpoint de autenticación en el backend.
  private apiUrl = `${API_URL.baseUrl}/api/auth`;

  /**
   * @constructor
   * @param http Cliente HTTP de Angular inyectado para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * @method registrarUsuario
   * @description Envía una petición POST para crear una nueva cuenta de usuario en el sistema.
   * Convierte el DTO en un FormData porque el backend usa @ModelAttribute.
   */
  registrarUsuario(registrarUsuarioDto: RegistrarUsuarioDto): Observable<MensajeDto<string>> {
    const formData = new FormData();

    // Add text fields / Agregar campos de texto
    formData.append('nombre', registrarUsuarioDto.nombre);
    formData.append('username', registrarUsuarioDto.username);
    formData.append('password', registrarUsuarioDto.password);

    // Add file only if exists / Agregar archivo solo si existe
    if (registrarUsuarioDto.fotoPerfil) {
      formData.append('fotoPerfil', registrarUsuarioDto.fotoPerfil);
    }

    return this.http.post<MensajeDto<string>>(`${this.apiUrl}/registro-usuario`, formData);
  }

  /**
   * @method login
   * @description Envía una petición POST para autenticar un usuario o administrador y obtener un token JWT.
   *
   * Este es un endpoint **público** (no requiere token).
   *
   * @param loginDto DTO con el username y la contraseña del usuario.
   * @returns Un {@link Observable} que emite la respuesta del backend, tipificada como {@link MensajeDto<TokenDto>}.
   * {@link TokenDto} contiene el token JWT que debe ser almacenado y usado para futuras peticiones.
   */
  login(loginDto: LoginDto): Observable<MensajeDto<TokenDto>> {
    // Petición POST al endpoint: /api/auth/login
    return this.http.post<MensajeDto<TokenDto>>(`${this.apiUrl}/login`, loginDto);
  }
}
