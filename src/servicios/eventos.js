// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.
// "API" simulada de eventos. Todas las funciones devuelven promesas y
// aceptan un AbortSignal, igual que lo haría un fetch real. En la tercera
// entrega estas funciones se reemplazan por peticiones a la API falsa.
//
// El catálogo sale de localStorage ('butaka:admin-eventos') si el panel de
// administración ya hizo cambios; si no, de los datos simulados. Así, un
// evento creado o eliminado en el panel también se ve en el sitio del cliente.

import { EVENTOS } from '../data/eventos.js';
import { CATEGORIAS } from '../data/categorias.js';
import { simularPeticion } from '../utils/simularPeticion.js';

export const CLAVE_EVENTOS_ADMIN = 'butaka:admin-eventos';

// Lista completa de eventos, con los cambios del panel si existen
export function catalogoEventos() {
  try {
    const guardado = localStorage.getItem(CLAVE_EVENTOS_ADMIN);
    if (guardado) return JSON.parse(guardado);
  } catch {
    // Si el valor guardado está dañado, se usan los datos simulados
  }
  return EVENTOS;
}

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// Lista de eventos, con búsqueda por texto y filtro por categoría.
// busqueda busca en título, lugar y ciudad, sin importar tildes ni mayúsculas.
export function obtenerEventos({ busqueda = '', categoria = '' } = {}, { signal } = {}) {
  return simularPeticion(
    () => {
      const termino = normalizar(busqueda.trim());
      return catalogoEventos().filter((evento) => {
        const coincideCategoria = !categoria || evento.categoria === categoria;
        const texto = normalizar(`${evento.titulo} ${evento.lugar} ${evento.ciudad}`);
        const coincideBusqueda = !termino || texto.includes(termino);
        return coincideCategoria && coincideBusqueda;
      });
    },
    { signal, probabilidadError: 0.1 },
  );
}

// Un solo evento. Si no existe, la promesa falla con un mensaje claro.
export function obtenerEventoPorId(id, { signal } = {}) {
  return simularPeticion(
    () => {
      const evento = catalogoEventos().find((item) => item.id === id);
      if (!evento) throw new Error('No encontramos este evento. Puede que ya no esté disponible.');
      return evento;
    },
    { signal, retraso: 500 },
  );
}

export function obtenerCategorias({ signal } = {}) {
  return simularPeticion(() => CATEGORIAS, { signal, retraso: 300 });
}
