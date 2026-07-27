import { getAllAsanas as getStaticAllAsanas, getAsanaById as getStaticAsanaById } from '@/data/asanas-registry';

export function getAllAsanas() {
  return getStaticAllAsanas();
}

export function getAsanaById(id) {
  return getStaticAsanaById(id);
}
