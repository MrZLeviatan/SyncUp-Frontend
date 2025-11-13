/**
 * @interface EditarPasswordDto
 * @description Data Transfer Object (DTO) utilizado para la transferencia de credenciales
 * necesarias para **actualizar la contraseña** de un usuario o administrador.
 *
 * Requiere el ID del usuario, la contraseña actual para verificación de seguridad, y la nueva contraseña.
 */
export interface EditarPasswordDto {
  id: number;
  passwordAnterior: string;
  nuevoPassword: string;
}
