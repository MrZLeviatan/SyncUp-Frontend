/**
 * @interface AdminDto
 * @description Data Transfer Object (DTO) para la transferencia de información completa y de autenticación de un Administrador.
 *
 * NOTA: La propiedad 'password' solo debe ser utilizada en el proceso de inicio de sesión o para el cambio de contraseña,
 * y nunca debe ser expuesta en respuestas de lectura de datos.
 */
export interface AdminDto {
  id: number;
  nombre: string;
  username: string;
  password: string;
}
