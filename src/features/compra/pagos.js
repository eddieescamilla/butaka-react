// DUEÑO: Gabriel. Módulo 5: sistema de pagos (simulado).
// Validación de la tarjeta y "pasarela de pago" falsa. Nunca se guarda
// el número completo de la tarjeta ni el CVV: solo los últimos 4 dígitos.

import { simularPeticion } from '../../utils/simularPeticion.js';

// Tarjetas de prueba para la demostración
export const TARJETAS_PRUEBA = {
  aprobada: '4242 4242 4242 4242',
  rechazada: '4000 0000 0000 0002',
};

export function soloDigitos(texto) {
  return texto.replace(/\D/g, '');
}

// "4242424242424242" → "4242 4242 4242 4242"
export function formatearNumeroTarjeta(texto) {
  return soloDigitos(texto).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
}

// "1228" → "12/28"
export function formatearVencimiento(texto) {
  const digitos = soloDigitos(texto).slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
}

// Algoritmo de Luhn: detecta números de tarjeta mal escritos
function pasaLuhn(numero) {
  let suma = 0;
  let doblar = false;
  for (let i = numero.length - 1; i >= 0; i -= 1) {
    let digito = Number(numero[i]);
    if (doblar) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
    doblar = !doblar;
  }
  return suma % 10 === 0;
}

export function validarPago(valores, hoy = new Date()) {
  const errores = {};
  const numero = soloDigitos(valores.numero);

  if (valores.titular.trim().length < 5 || !valores.titular.trim().includes(' ')) {
    errores.titular = 'Escribe el nombre como aparece en la tarjeta (nombre y apellido).';
  }

  if (numero.length !== 16) errores.numero = 'El número de tarjeta debe tener 16 dígitos.';
  else if (!pasaLuhn(numero)) errores.numero = 'Este número de tarjeta no es válido. Revisa que esté bien escrito.';

  const [mes, anio] = valores.vencimiento.split('/').map(Number);
  if (!/^\d{2}\/\d{2}$/.test(valores.vencimiento) || mes < 1 || mes > 12) {
    errores.vencimiento = 'Usa el formato MM/AA, por ejemplo 08/28.';
  } else {
    // La tarjeta vence al final del mes indicado
    const finDeMes = new Date(2000 + anio, mes, 0, 23, 59, 59);
    if (finDeMes < hoy) errores.vencimiento = 'La tarjeta está vencida.';
  }

  if (!/^\d{3,4}$/.test(valores.cvv)) errores.cvv = 'El CVV son los 3 o 4 dígitos al reverso de la tarjeta.';

  return errores;
}

// Pasarela simulada: la tarjeta de prueba "rechazada" siempre falla
export function procesarPago({ numero, total }) {
  return simularPeticion(
    () => {
      if (soloDigitos(numero) === soloDigitos(TARJETAS_PRUEBA.rechazada)) {
        throw new Error('El banco rechazó el pago por fondos insuficientes.');
      }
      return { aprobado: true, total, autorizacion: `AUT-${Math.floor(100000 + Math.random() * 900000)}` };
    },
    { retraso: 1500 },
  );
}
