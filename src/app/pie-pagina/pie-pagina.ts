import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pie-pagina',
  imports: [CommonModule],
  templateUrl: './pie-pagina.html',
  styleUrl: './pie-pagina.css',
  standalone: true,
})
export class PiePagina {
  currentYear = new Date().getFullYear();
  logoPrincipal = 'images/logoJep.jpg';
}
