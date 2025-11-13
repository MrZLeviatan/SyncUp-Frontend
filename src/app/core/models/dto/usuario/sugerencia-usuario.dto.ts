/**
 * @interface SugerenciaUsuariosDto
 * @description Data Transfer Object (DTO) utilizado para transferir información básica de un usuario
 * con fines de sugerencia o listado de contactos, como en funciones de búsqueda o autocompletado.
 *
 * Contiene solo la información esencial y no incluye datos sensibles como contraseñas.
 */
export interface SugerenciaUsuariosDto {
  id: number;
  nombre: string;
  username: string;
}
