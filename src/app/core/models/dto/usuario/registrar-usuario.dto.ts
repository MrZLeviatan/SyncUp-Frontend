/**
 * @interface RegistrarUsuarioDto
 * @description Data Transfer Object (DTO) utilizado para la transferencia de credenciales
 * e información básica necesarias para **registrar un nuevo Usuario** en el sistema.
 */
export interface RegistrarUsuarioDto {
  nombre: string;
  username: string;
  password: string;
}
