/**
 * @interface UsuarioConexionDto
 * @description Data Transfer Object (DTO) utilizado para la transferencia de identificadores
 * en operaciones que involucran la relación entre dos usuarios, como seguir/dejar de seguir
 * o iniciar una conexión.
 *
 * Contiene el ID del usuario que inicia la acción (principal) y el ID del usuario afectado (objetivo).
 */
export interface UsuarioConexionDto {
  idUsuarioPrincipal: number;
  idUsuarioObjetivo: number;
}
