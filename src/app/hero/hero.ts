import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  standalone: true,
})
export class Hero {
  mensajeParaTi = 'mensaje-para-tus-dios'; // ID from original HTML
}
