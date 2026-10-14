import { store } from "./config";

const formatter = new Intl.NumberFormat(store.locale, {
  maximumFractionDigits: 0,
});

export function price(value: number) {
  return `${store.currency}\u00A0${formatter.format(value)}`;
}

export function deliveryFor(subtotal: number) {
  if (subtotal === 0) return 0;
  return subtotal >= store.freeDeliveryOver ? 0 : store.deliveryFee;
}
