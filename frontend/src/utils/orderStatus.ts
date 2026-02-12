import type { OrderStatus } from "../types/order";

export function statusLabel(status: OrderStatus) {
  switch (status) {
    case 0: return "Pendente";
    case 1: return "Processando";
    case 2: return "Finalizado";
    default: return "Desconhecido";
  }
}

export function statusClasses(status: OrderStatus) {
  switch (status) {
    case 0: return "bg-yellow-100 text-yellow-800";
    case 1: return "bg-blue-100 text-blue-800 animate-pulse";
    case 2: return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-700";
  }
}
