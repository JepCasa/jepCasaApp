import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TarjetaActividadData {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  colorTitulo?: string;
  enlaceInstagram?: string;
  enlaceMapa?: string;
  boton?: string;
}

@Component({
  selector: 'app-tarjeta-actividad',
  imports: [CommonModule],
  templateUrl: './tarjeta-actividad.html',
  styleUrl: './tarjeta-actividad.css',
  standalone: true,
})
export class TarjetaActividad {
  actividad = input.required<TarjetaActividadData>();
}
