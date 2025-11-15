/**
 * @interface LoginDto
 * @description Data Transfer Object (DTO) utilizado para transferir las credenciales
 * necesarias para iniciar sesión o autenticarse en el sistema.
 *
 * Contiene únicamente los campos requeridos para la verificación de identidad.
 */
export interface LoginDto {
  username: string;
  password: string;
}
