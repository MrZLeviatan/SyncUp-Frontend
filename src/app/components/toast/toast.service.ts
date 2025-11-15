import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'; // Importa Observable para tipar el stream público.

/**
 * @description
 * Tipos de estilo que puede tener una notificación toast.
 */
export type ToastType = 'success' | 'error' | 'info';

/**
 * @description
 * Interfaz que define la estructura de una notificación toast.
 *
 * @property {string} message - El texto principal que se mostrará al usuario.
 * @property {ToastType} type - El tipo de toast, usado para aplicar estilos (color).
 * @property {number} [duration] - Duración opcional en milisegundos antes de que se oculte automáticamente.
 */
export interface Toast {
  message: string;
  type: ToastType;
  duration?: number;
}

/**
 * @description
 * Servicio encargado de gestionar el estado reactivo de las notificaciones toast activas.
 * Utiliza RxJS {@link BehaviorSubject} para notificar al componente {@link Toast}
 * cuando se añade o se elimina una notificación.
 *
 * @export
 * @class ToastService
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /**
   * @description
   * Fuente de datos privada que almacena el array de notificaciones activas.
   * {@link BehaviorSubject} se inicializa con un array vacío.
   * @private
   */
  private _toasts = new BehaviorSubject<Toast[]>([]);

  /**
   * @description
   * Stream público de solo lectura (Observable) para que los componentes puedan suscribirse
   * a los cambios en la lista de toasts.
   * @public
   */
  public readonly toasts$: Observable<Toast[]> = this._toasts.asObservable();

  /**
   * @description
   * Getter que proporciona acceso síncrono al valor actual del array de toasts.
   * Esto es útil para el template del componente.
   *
   * @returns {Toast[]} El array actual de notificaciones.
   */
  get toasts(): Toast[] {
    return this._toasts.value;
  }

  /**
   * @description
   * Muestra una nueva notificación en la pantalla y programa su eliminación.
   *
   * @param {string} message - El mensaje a mostrar.
   * @param {ToastType} [type='info'] - El tipo de toast (success, error, info). Por defecto es 'info'.
   * @param {number} [duration=5000] - Tiempo en ms que la notificación permanecerá visible. Por defecto son 5 segundos.
   */
  show(message: string, type: ToastType = 'info', duration: number = 5000) {
    // Crea el objeto toast con la información proporcionada.
    const toast: Toast = { message, type, duration };

    // Emite un nuevo array al BehaviorSubject, usando el array actual más la nueva notificación.
    // Esto hace que el componente se actualice y muestre el nuevo toast.
    this._toasts.next([...this.toasts, toast]);

    // Programa la eliminación automática del toast después de la duración especificada.
    setTimeout(() => this.remove(toast), duration);
  }

  /**
   * @description
   * Elimina una notificación específica de la lista de toasts activos.
   *
   * @param {Toast} toast - La notificación específica a eliminar.
   */
  remove(toast: Toast) {
    // Filtra el array actual, creando uno nuevo que excluye el toast dado.
    // Luego, emite el nuevo array filtrado al BehaviorSubject, actualizando la vista.
    this._toasts.next(this.toasts.filter((t) => t !== toast));
  }
}
