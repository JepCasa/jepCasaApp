/**
 * ============================================================
 *  APPS SCRIPT — Guardar / editar respuestas de Estudio Jóvenes
 * ============================================================
 *
 *  CÓMO DESPLEGAR (una sola vez):
 *  1. Abrí la planilla: https://docs.google.com/spreadsheets/d/1vj3p7cYZ665VkWnPWnwhNJyVlbLuuSSLfCnwcZVO8wg
 *  2. Menú: Extensiones → Apps Script
 *  3. Borrá el código que venga y pegá ESTE archivo entero.
 *  4. Guardá (Ctrl+S) y luego click en "Implementar" → "Nueva implementación".
 *  5. Tipo de implementación: "Aplicación web".
 *  6. Ejecutar como: "Yo"  |  Acceso: "Cualquier persona".
 *  7. Click en "Implementar", aceptar permisos.
 *  8. Copiá la URL de la aplicación web (termina en /exec)
 *     y pegala en jovenes.service.ts como GUARDAR_RESPUESTA_URL.
 *
 *  Nota: los nombres de las hojas deben ser "Respuestas" y "Estudios".
 *  Si en tu planilla se llaman distinto, cambiá las constantes de abajo.
 * ============================================================
 */

var NOMBRE_HOJA_RESPUESTAS = 'Respuestas';
var NOMBRE_HOJA_ESTUDIOS = 'Estudios';

/**
 * Recibe el POST desde la app.
 * Body (JSON): { estudio_id, texto, fecha }
 *  - estudio_id: id de la tarjeta (Estudios).
 *  - texto:      respuesta del joven.
 *  - fecha:      fecha en que respondió (DD/MM/YYYY).
 */
function doPost(e) {
  var datos = JSON.parse(e.postData.contents);
  var resultado = guardarRespuesta(datos);

  return ContentService
    .createTextOutput(JSON.stringify(resultado))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('OK');
}

/**
 * Inserta o actualiza la fila de la respuesta y marca el estudio como respondida.
 */
function guardarRespuesta(datos) {
  var estudioId = Number(datos.estudio_id);
  var texto = String(datos.texto || '').trim();
  var fecha = String(datos.fecha || '');

  if (!estudioId || !texto) {
    return { ok: false, error: 'Faltan datos (estudio_id o texto)' };
  }

  try {
    var hojaRespuestas = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(NOMBRE_HOJA_RESPUESTAS);

    var hojaEstudios = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(NOMBRE_HOJA_ESTUDIOS);

    editarOCrearRespuesta(hojaRespuestas, estudioId, texto, fecha);
    marcarEstudioRespondido(hojaEstudios, estudioId);

    return { ok: true, estudio_id: estudioId };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

/**
 * Si la respuesta ya existe la edita; si no, agrega una fila nueva.
 * Columnas: estudio_id, pregunta1, pregunta2, pregunta3, fecha
 */
function editarOCrearRespuesta(hoja, estudioId, texto, fecha) {
  var valores = hoja.getDataRange().getValues();
  var encabezados = valores[0];

  var colEstudio = encabezados.indexOf('estudio_id') + 1;
  var colPregunta1 = encabezados.indexOf('pregunta1') + 1;
  var colFecha = encabezados.indexOf('fecha') + 1;

  for (var i = 1; i < valores.length; i++) {
    if (Number(valores[i][colEstudio - 1]) === estudioId) {
      hoja.getRange(i + 1, colPregunta1).setValue(texto);
      hoja.getRange(i + 1, colFecha).setValue(fecha);
      return;
    }
  }

  hoja.appendRow([estudioId, texto, '', '', fecha]);
}

/**
 * Cambia el estado de la tarjeta a "Respondida".
 */
function marcarEstudioRespondido(hoja, estudioId) {
  var valores = hoja.getDataRange().getValues();
  var encabezados = valores[0];

  var colId = encabezados.indexOf('id') + 1;
  var colEstado = encabezados.indexOf('estado') + 1;

  for (var i = 1; i < valores.length; i++) {
    if (Number(valores[i][colId - 1]) === estudioId) {
      hoja.getRange(i + 1, colEstado).setValue('Respondida');
      return;
    }
  }
}