/**
 * @interface UsuarioDto
 * @description Data Transfer Object (DTO) que representa la información completa de un Usuario
 * dentro del sistema, incluyendo sus relaciones con otros elementos.
 *
 * NOTA: La propiedad 'password' solo debe incluirse en DTOs utilizados para registro o login,
 * y se incluye aquí bajo el supuesto de que este DTO se usa en el contexto de un perfil
 * donde la misma clase DTO también maneja credenciales iniciales.
 */
export interface UsuarioDto {
  id: number;
  nombre: string;
  username: string;
  password: string;
  fotoPerfilUrl: string;
}
