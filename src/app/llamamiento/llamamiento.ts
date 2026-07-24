import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-llamamiento',
  imports: [CommonModule],
  templateUrl: './llamamiento.html',
  styleUrl: './llamamiento.css',
  standalone: true,
})
export class Llamamiento {
  mensajeTitulo = 'Hay Alguien que te Ama ❤️';
  mensajeSubtitulo = 'Dios te ve, te conoce y quiere llenar ese vacío del alma que nada más puede llenar.';
  prrafoAdicional = 'No importa tu pasado, Él tiene un prop\u00f3sito para vos.';
}
