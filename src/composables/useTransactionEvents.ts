// Event Bus para sincronización de transacciones

// Tipos de eventos
export enum TransactionEvent {
  CREATED = 'transaction:created',
  UPDATED = 'transaction:updated',
  DELETED = 'transaction:deleted',
  REFRESH = 'transaction:refresh'
}

// Event listeners
type EventCallback = () => void;
const listeners = new Map<TransactionEvent, Set<EventCallback>>();

// Suscribirse a un evento
export function onTransactionEvent(event: TransactionEvent, callback: EventCallback) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event)?.add(callback);

  // Retornar función para desuscribirse
  return () => {
    listeners.get(event)?.delete(callback);
  };
}

// Emitir un evento
export function emitTransactionEvent(event: TransactionEvent) {
  console.log('📢 Emitiendo evento:', event);
  listeners.get(event)?.forEach(callback => callback());
}

// Composable para usar en componentes
export function useTransactionEvents() {
  const subscribe = (event: TransactionEvent, callback: EventCallback) => {
    return onTransactionEvent(event, callback);
  };

  const emit = (event: TransactionEvent) => {
    emitTransactionEvent(event);
  };

  return {
    subscribe,
    emit,
    TransactionEvent
  };
}

