import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadService } from '../actividad.service';
import { Encabezado } from "../encabezado/encabezado";
import { Hero } from "../hero/hero";
import { TarjetaActividad } from "../tarjeta-actividad/tarjeta-actividad";
import { PiePagina } from "../pie-pagina/pie-pagina";

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, TarjetaActividad, Encabezado, Hero, PiePagina],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  standalone: true,
})
export class Inicio {
  private actividadService = inject(ActividadService);
  
  get actividades() {
    return this.actividadService.actividades();
  }
}
