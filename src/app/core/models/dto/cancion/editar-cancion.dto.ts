/**
 * @interface EditarCancionDto
 * @description Data Transfer Object (DTO) utilizado para **modificar parcialmente** los datos de una Canción existente.
 *
 * Las propiedades opcionales (marcadas con ?) permiten que este DTO se utilice para actualizar
 * solo uno o varios campos sin requerir la transferencia de todos los datos de la canción.
 */
export interface EditarCancionDto {
  id: number;
  titulo?: string;
  fechaLanzamiento?: string;
}
