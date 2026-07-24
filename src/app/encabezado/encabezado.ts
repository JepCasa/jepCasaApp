import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadService } from '../actividad.service';

@Component({
  selector: 'app-encabezado',
  imports: [CommonModule],
  templateUrl: './encabezado.html',
  styleUrl: './encabezado.css',
  standalone: true,
})
export class Encabezado {
  private actividadService = inject(ActividadService);
  
  logoPrincipal = 'images/logoJep.jpg';
  logoDeportes = 'images/jepDeportesLogo.jpeg';
}
