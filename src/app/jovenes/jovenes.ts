import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JovenesService } from './service/jovenes.service';


interface Configuracion {
  anio: number;
  libro: string;
  equipo1: string;
  equipo2: string;
  puntos_responder: number;
  puntos_corazon: number;
}

interface Estudio {
  id: number;
  fecha: string;
  joven: string;
  equipo: number;
  pasaje: string;
  estado: string;
}

interface Libro {

  año: number;
  mes: number;
  libro: string;
  informacion: string;

  pregunta1: string;
  pregunta2: string;
  pregunta3: string;

}

// =========================
// PUNTOS POR RESPUESTA
// Responde el mismo día de su tarjeta: 50 pts
// Respuestas en el mismo mes (otro día): 35 pts
// Respuestas en cualquier otro mes: 10 pts
// =========================

const PUNTOS_MISMA_FECHA = 50;
const PUNTOS_MISMO_MES = 35;
const PUNTOS_OTRO_MES = 10;

interface FechaComparable {
  dia: number;
  mes: number;
  anio: number;
}

// function parsearFecha(fecha: string, anioReferencia: number): FechaComparable | null {

//   const partes = fecha.split('/').map(n => parseInt(n, 10));

//   let dia: number;
//   let mes: number;
//   let anio: number;

//   if (partes.length === 3) {
//     [dia, mes, anio] = partes;
//   } else if (partes.length === 2) {
//     [dia, mes] = partes;
//     anio = anioReferencia;
//   } else {
//     return null;
//   }

//   if (!dia || !mes || dia < 1 || dia > 31 || mes < 1 || mes > 12) {
//     return null;
//   }

//   return { dia, mes, anio };

// }

function parsearFecha(
  fecha: string,
  anioReferencia: number
): FechaComparable | null {

  if (!fecha) {
    return null;
  }

  const texto = fecha
    .toLowerCase()
    .trim();

  const meses: Record<string, number> = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12
  };

  // Formato:
  // "domingo, 30 de agosto de 2026"
  const match = texto.match(
    /(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})/
  );

  if (match) {
    const dia = Number(match[1]);
    const mes = meses[match[2]];
    const anio = Number(match[3]);

    if (!mes) {
      return null;
    }

    return {
      dia,
      mes,
      anio
    };
  }

  // Formato DD/MM/YYYY
  const partes = texto
    .split('/')
    .map(n => parseInt(n, 10));

  if (partes.length === 3) {
    const [dia, mes, anio] = partes;

    if (
      !dia ||
      !mes ||
      !anio ||
      dia < 1 ||
      dia > 31 ||
      mes < 1 ||
      mes > 12
    ) {
      return null;
    }

    return {
      dia,
      mes,
      anio
    };
  }

  // Formato DD/MM
  if (partes.length === 2) {
    const [dia, mes] = partes;

    if (
      !dia ||
      !mes ||
      dia < 1 ||
      dia > 31 ||
      mes < 1 ||
      mes > 12
    ) {
      return null;
    }

    return {
      dia,
      mes,
      anio: anioReferencia
    };
  }

  return null;
}

function puntosSegunFechas(fechaEstudio: string, fechaRespuesta: string): number {

  const anioReferencia = new Date().getFullYear();

  const estudio = parsearFecha(fechaEstudio, anioReferencia);
  const respuesta = parsearFecha(fechaRespuesta, anioReferencia);

  if (!estudio || !respuesta) {
    return 0;
  }

  const mismoDia =
    respuesta.dia === estudio.dia &&
    respuesta.mes === estudio.mes &&
    respuesta.anio === estudio.anio;

  if (mismoDia) {
    return PUNTOS_MISMA_FECHA;
  }

  const mismoMes =
    respuesta.mes === estudio.mes &&
    respuesta.anio === estudio.anio;

  return mismoMes ? PUNTOS_MISMO_MES : PUNTOS_OTRO_MES;

}

@Component({
  selector: 'app-jovenes',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './jovenes.html',
  styleUrl: './jovenes.css',
})

export class Jovenes implements OnInit {

  constructor(
    private jovenesService: JovenesService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  // =========================
  // CONFIGURACION
  // =========================

  configuracion: Configuracion = {
    anio: 0,
    libro: '',
    equipo1: '',
    equipo2: '',
    puntos_responder: 0,
    puntos_corazon: 0
  };

  // =========================
  // MESES
  // =========================

  meses = [
    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' }
  ];

  mesSeleccionado = new Date().getMonth() + 1;

  textoBusqueda = '';

  // =========================
  // EQUIPOS
  // =========================

  equipo1 = {
    nombre: '',
    puntos: 0,
    porcentaje: 50
  };

  equipo2 = {
    nombre: '',
    puntos: 0,
    porcentaje: 50
  };

  equipoSeleccionadoMobile: number = 1;

  // =========================
  // ESTUDIOS
  // =========================

  estudios: Estudio[] = [];

  estudiosEquipo1: Estudio[] = [];
  estudiosEquipo2: Estudio[] = [];

  usuarios: any[] = [];

  libros: Libro[] = [];

  respuestas: any[] = [];

  reacciones: any[] = [];

  estudiosOriginales: any[] = [];

  libroActual: Libro | null = null;

  // =========================
  // RESPUESTAS EN EDICIÓN
  // =========================

  estudioEnEdicion: number | null = null;

  textosRespuesta: Record<number, string> = {};

  guardandoRespuesta = false;

  cargando = true;
  errorCarga = false;

  mostrarAvisoFecha = false;
  estudioBloqueado: any = null;
  // =========================
  // INIT
  // =========================

  async ngOnInit() {
    await this.cargarTodo();
  }

  async cargarTodo() {

    this.cargando = true;
    this.errorCarga = false;

    try {

      const [
        configuracion,
        usuarios,
        libros,
        estudios,
        respuestas,
        reacciones
      ] = await Promise.all([

        this.jovenesService.obtenerConfiguracion(),

        this.jovenesService.obtenerUsuarios(),

        this.jovenesService.obtenerLibros(),

        this.jovenesService.obtenerEstudios(),

        this.jovenesService.obtenerRespuestas(),

        this.jovenesService.obtenerReacciones()

      ]);

      // =====================================================
      // USUARIOS
      // =====================================================

      this.usuarios = usuarios.map(u => ({
        id: Number(u.id),
        nombre: u.nombre,
        equipo: Number(u.equipo)
      }));

      // =====================================================
      // LIBROS
      // =====================================================

      this.libros = libros.map(l => ({
        año: Number(l.año),
        mes: Number(l.mes),
        libro: l.libro,
        informacion: l.informacion,
        pregunta1: l.pregunta1,
        pregunta2: l.pregunta2,
        pregunta3: l.pregunta3
      }));

      // =====================================================
      // CONFIGURACION
      // =====================================================

      const config = configuracion[0];

      this.configuracion = {
        anio: Number(config.anio),
        libro: '',
        equipo1: config.equipo1,
        equipo2: config.equipo2,
        puntos_responder: Number(config.puntos_responder),
        puntos_corazon: Number(config.puntos_corazon)
      };

      this.equipo1.nombre =
        this.configuracion.equipo1;

      this.equipo2.nombre =
        this.configuracion.equipo2;

      // =====================================================
      // ESTUDIOS
      // =====================================================

      this.estudiosOriginales = estudios.map(e => {

        const usuario = this.usuarios.find(
          u => u.id === Number(e.joven_id)
        );

        return {
          id: Number(e.id),
          mes: Number(e.mes),
          fecha: e.fecha,
          joven: usuario?.nombre ?? 'Sin nombre',
          equipo: usuario?.equipo ?? 0,
          pasaje: e.pasaje,
          estado: e.estado
        };

      });

      // =====================================================
      // RESPUESTAS Y REACCIONES
      // =====================================================

      this.respuestas = respuestas;
      this.reacciones = reacciones;

      // =====================================================
      // MES ACTUAL
      // =====================================================

      this.cambiarMes(
        new Date().getMonth() + 1
      );

      this.cdr.detectChanges();

    } catch (error) {

      console.error(
        'Error cargando datos:',
        error
      );

      this.errorCarga = true;

    } finally {

      this.cargando = false;

      this.cdr.detectChanges();

    }
  }

  seleccionarEquipoMobile(equipo: number) {
    this.equipoSeleccionadoMobile = equipo;
  }

  cambiarMes(mes: number) {
    this.mesSeleccionado = mes;

    this.libroActual =
      this.libros.find(l =>

        l.mes === mes &&
        l.año === this.configuracion.anio

      ) ?? null;

    this.configuracion.libro =
      this.libroActual?.libro ?? "";

    this.estudios =
      this.estudiosOriginales.filter(e =>
        e.mes === mes
      );

    this.filtrarEquipos();

    this.calcularRanking();

    console.log(
      "MES CARGADO",
      mes,
      this.libroActual,
      this.estudios
    );
  }

  mostrarInfoLibro = false;

  verInfoLibro(): void {
    this.mostrarInfoLibro = true;
  }

  cerrarInfoLibro(): void {
    this.mostrarInfoLibro = false;
  }
  // =========================
  // FILTRO
  // =========================

  filtrarEquipos() {
    const texto =
      this.textoBusqueda.toLowerCase();

    const lista =
      this.estudios.filter(e =>
        (e.joven ?? "")
          .toLowerCase()
          .includes(texto)
      );

    this.estudiosEquipo1 =
      lista.filter(e => e.equipo === 1);

    this.estudiosEquipo2 =
      lista.filter(e => e.equipo === 2);
  }

  buscar() {
    this.filtrarEquipos();
  }

  // =========================
  // RANKING
  // =========================

  calcularRanking() {

    let puntos1 = 0;
    let puntos2 = 0;

    this.estudios.forEach(estudio => {
      if (estudio.estado !== 'Respondida') {
        return;
      }
      const puntos = this.calcularPuntos(estudio);
      if (estudio.equipo === 1) {
        puntos1 += puntos;
      }
      if (estudio.equipo === 2) {
        puntos2 += puntos;
      }
    });

    this.equipo1.puntos = puntos1;
    this.equipo2.puntos = puntos2;
    const total = puntos1 + puntos2;

    if (total > 0) {

      this.equipo1.porcentaje =
        Math.round((puntos1 * 100) / total);

      this.equipo2.porcentaje =
        Math.round((puntos2 * 100) / total);

    } else {

      this.equipo1.porcentaje = 50;
      this.equipo2.porcentaje = 50;

    }
  }

  // =========================
  // RESPUESTAS
  // =========================

  private puedeResponder(estudio: Estudio): boolean {

    const fechaEstudio = parsearFecha(
      estudio.fecha,
      this.configuracion.anio
    );

    if (!fechaEstudio) {
      return false;
    }

    const hoy = new Date();

    const fechaEstudioNumero =
      fechaEstudio.anio * 10000 +
      fechaEstudio.mes * 100 +
      fechaEstudio.dia;

    const hoyNumero =
      hoy.getFullYear() * 10000 +
      (hoy.getMonth() + 1) * 100 +
      hoy.getDate();

    // Se puede responder hoy o cualquier fecha anterior.
    // Solo se bloquean fechas futuras.
    return fechaEstudioNumero <= hoyNumero;
  }

  abrirEdicion(estudio: Estudio) {

    // No permitir responder antes de la fecha correspondiente
    if (!this.puedeResponder(estudio)) {
      this.estudioBloqueado = estudio;
      this.mostrarAvisoFecha = true;
      return;
    }

    if (this.estudioEnEdicion === estudio.id) {

      this.estudioEnEdicion = null;
      return;

    }

    this.estudioEnEdicion = estudio.id;

    if (this.textosRespuesta[estudio.id] === undefined) {

      this.textosRespuesta[estudio.id] =
        this.textoDeRespuesta(estudio);

    }

  }

  cerrarEdicion() {
    this.estudioEnEdicion = null;
  }

  cerrarAvisoFecha(): void {
    this.mostrarAvisoFecha = false;
    this.estudioBloqueado = null;
  }

  textoDeRespuesta(estudio: Estudio): string {

    const respuesta = this.respuestas.find(r =>
      Number(r.estudio_id) === estudio.id
    );

    return respuesta?.pregunta1 ?? '';

  }

  async guardarRespuesta(estudio: Estudio) {

    const texto =
      (this.textosRespuesta[estudio.id] ?? '').trim();

    if (!texto || this.guardandoRespuesta) {
      return;
    }

    this.guardandoRespuesta = true;

    try {

      const fecha = this.fechaHoy();

      console.log('Guardando respuesta...');

      await this.jovenesService.guardarRespuesta({
        estudio_id: estudio.id,
        texto,
        fecha
      });

      console.log('Respuesta guardada en servidor');

      // ==========================================
      // VOLVER AL CONTEXTO DE ANGULAR
      // ==========================================

      this.ngZone.run(() => {

        // Actualizamos el estudio
        this.actualizarRespuestaLocal(
          estudio,
          texto,
          fecha
        );

        // 🔊 REPRODUCIR CELEBRACIÓN
        this.reproducirCelebracion();

        // Cerramos el editor
        this.estudioEnEdicion = null;

        // Recalculamos puntos
        this.calcularRanking();

        // Terminó de guardar
        this.guardandoRespuesta = false;

        console.log('Estado actualizado:', estudio.estado);

        // Forzamos detección
        this.cdr.detectChanges();

      });

    } catch (error) {

      console.error(
        'Error guardando la respuesta:',
        error
      );

      this.ngZone.run(() => {

        this.guardandoRespuesta = false;

        this.cdr.detectChanges();

        alert(
          'No se pudo guardar la respuesta. Revisá la conexión y probá de nuevo.'
        );

      });

    }
  }

  reproducirCelebracion(): void {
    const audio = new Audio('assets/sounds/festejo.mp3');
    audio.play().catch(error => {
      console.error('No se pudo reproducir el audio:', error);
    });
  }

  private actualizarRespuestaLocal(
    estudio: Estudio,
    texto: string,
    fecha: string
  ) {

    // Marcar como respondida
    estudio.estado = 'Respondida';

    // Buscar si ya existe la respuesta
    const respuesta = this.respuestas.find(
      r => Number(r.estudio_id) === estudio.id
    );

    if (respuesta) {

      respuesta.pregunta1 = texto;
      respuesta.fecha = fecha;

    } else {

      this.respuestas.unshift({
        estudio_id: estudio.id,
        pregunta1: texto,
        pregunta2: '',
        pregunta3: '',
        fecha
      });

    }

  }

  calcularPuntos(estudio: Estudio): number {

    const respuesta = this.respuestas.find(r =>
      Number(r.estudio_id) === estudio.id
    );

    if (!respuesta?.fecha) {
      return 0;
    }

    return puntosSegunFechas(
      estudio.fecha,
      respuesta.fecha
    );

  }

  private fechaHoy(): string {

    const hoy = new Date();

    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');

    return `${dia}/${mes}/${hoy.getFullYear()}`;

  }

  capitalizarFecha(fecha: string): string {
    if (!fecha) return '';

    return fecha.charAt(0).toUpperCase() + fecha.slice(1);
  }

}