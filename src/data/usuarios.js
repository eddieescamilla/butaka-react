// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.
// Usuarios ficticios. No son datos personales reales: los correos usan el
// dominio de ejemplo correo.com y la contraseña es la misma para todos,
// porque la autenticación es simulada (no hay backend).

export const CONTRASENA_DEMO = 'Butaka2026';

export const USUARIOS = [
  {
    id: 'usr-001',
    nombre: 'Ana',
    apellido: 'López',
    correo: 'ana.lopez@correo.com',
    contrasena: CONTRASENA_DEMO,
    rol: 'cliente',
    estado: 'activo',
    creado: '2026-03-14',
  },
  {
    id: 'usr-002',
    nombre: 'Carlos',
    apellido: 'Martínez',
    correo: 'carlos.m@correo.com',
    contrasena: CONTRASENA_DEMO,
    rol: 'admin',
    estado: 'activo',
    creado: '2026-01-08',
  },
  {
    id: 'usr-003',
    nombre: 'Sofía',
    apellido: 'Hernández',
    correo: 'sofia.h@correo.com',
    contrasena: CONTRASENA_DEMO,
    rol: 'organizador',
    estado: 'activo',
    creado: '2026-02-20',
  },
  {
    id: 'usr-004',
    nombre: 'Diego',
    apellido: 'Ramírez',
    correo: 'diego.r@correo.com',
    contrasena: CONTRASENA_DEMO,
    rol: 'cliente',
    estado: 'inactivo',
    creado: '2026-05-02',
  },
  {
    id: 'usr-005',
    nombre: 'María',
    apellido: 'Pérez',
    correo: 'maria.p@correo.com',
    contrasena: CONTRASENA_DEMO,
    rol: 'organizador',
    estado: 'activo',
    creado: '2026-04-11',
  },
  {
    id: 'usr-006',
    nombre: 'Luis',
    apellido: 'Guzmán',
    correo: 'luis.g@correo.com',
    contrasena: CONTRASENA_DEMO,
    rol: 'cliente',
    estado: 'activo',
    creado: '2026-08-30',
  },
];
