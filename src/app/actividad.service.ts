import { Injectable, signal, computed } from '@angular/core';

export interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  colorTitulo?: string;
  enlaceInstagram?: string;
  enlaceMapa?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private actividadesSignal = signal<Actividad[]>([
    {
      id: 1,
      titulo: 'Reunión General',
      descripcion: '📅 Domingos 10:00 hs<br>Un tiempo de adoración, palabra y comunión.',
      imagen: '/images/jepcasa2.jpg',
      colorTitulo: '#1e3a8a',
      enlaceInstagram: 'https://www.instagram.com/jepcasa/',
      enlaceMapa: 'https://maps.app.goo.gl/AFFJ3zzauuSs1ewo6'
    },
    {
      id: 2,
      titulo: 'JEP Deportes',
      descripcion: '⚽🏐 Sábados 11:00 hs (Fútbol, Vóley)<br>¡Un hermoso tiempo entre amigos!',
      imagen: '/images/jepDeportes.jpg',
      colorTitulo: '#16a34a',
      enlaceInstagram: 'https://www.instagram.com/jepdeportes/'
    },
    {
      id: 3,
      titulo: 'JEP Deportes',
      descripcion: '🏓Jueves 18:00 hs (Ping Pong).<br>¡Clases gratis y diversión asegurada!',
      imagen: '/images/jepPingPong.jpg',
      colorTitulo: '#0ea5e9',
    },
    {
      id: 4,
      titulo: 'Reunión de Jóvenes',
      descripcion: '📅 2° y 4° Sábado - 18:30 hs<br>Merienda, palabra, música y amistad. ¡No faltes!',
      imagen: '/images/jepJovenes2.jpg',
      colorTitulo: '#eab308',
    },
    {
      id: 5,
      titulo: 'Teatro Negro',
      descripcion: '🎭 Actividades y obras especiales para fechas destacadas.<br>¡Arte con propósito!',
      imagen: '/images/teatroNegro.jpg',
      colorTitulo: '#1e3a8a',
    },
    {
      id: 6,
      titulo: 'Reunión de Oración',
      descripcion: '🙏 Miércoles 19:00 hs<br>Un tiempo de oración y palabra para todos.',
      imagen: '/images/oracion.jpg',
      colorTitulo: '#0ea5e9',
    },
    {
      id: 7,
      titulo: 'JEP Kids',
      descripcion: '🎨 Juegos y historias bíblicas para los más pequeños.<br>¡Aprender y divertirse!',
      imagen: '/images/jepKids.jpg',
      colorTitulo: '#ff6600',
    },
    {
      id: 8,
      titulo: 'Reunión de Mujeres',
      descripcion: '📅 2° y 4° Sábado - 16:00 hs<br>Un espacio de palabra, oración y comunión entre hermanas.',
      imagen: '/images/mujeres.jpeg',
      colorTitulo: '#dc2626',
    },
    {
      id: 9,
      titulo: 'Reunión de Hombres',
      descripcion: '📅 Viernes 19:00 hs<br>Compartimos palabra, oración y crecimiento en la fe.',
      imagen: '/images/hombres.jpg',
      colorTitulo: '#06b6d4',
    },
  ]);

  actividades = computed(() => this.actividadesSignal());

  agregarActividad(actividad: Actividad) {
    this.actividadesSignal.update(actividades => [...actividades, actividad]);
  }

  actualizarActividad(id: number, actividadActualizada: Partial<Actividad>) {
    this.actividadesSignal.update(actividades =>
      actividades.map(a => a.id === id ? { ...a, ...actividadActualizada } : a)
    );
  }

  eliminarActividad(id: number) {
    this.actividadesSignal.update(actividades =>
      actividades.filter(a => a.id !== id)
    );
  }
}
