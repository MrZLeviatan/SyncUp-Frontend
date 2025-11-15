/**
 * @interface EditarUsuarioDto
 * @description Data Transfer Object (DTO) utilizado para la transferencia de datos
 * necesarios para **modificar el perfil básico de un Usuario**.
 *
 * NOTA: Este DTO está diseñado para actualizaciones parciales, permitiendo modificar
 * solo el 'nombre' sin alterar otras propiedades como el 'username' o la 'password'.
 */
export interface EditarUsuarioDto {
  id: number;
  nombre: string;
}
