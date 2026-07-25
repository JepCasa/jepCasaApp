import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-llamamiento',
  imports: [CommonModule, RouterLink],
  templateUrl: './llamamiento.html',
  styleUrl: './llamamiento.css',
  standalone: true,
})
export class Llamamiento implements OnInit, OnDestroy {

  mensajeTitulo = 'Hay Alguien que te Ama ❤️';

  mensajeSubtitulo =
    'Dios te ve, te conoce y quiere llenar ese vacío del alma que nada más puede llenar.';

  prrafoAdicional =
    'No importa tu pasado. En Jesús hay perdón, esperanza y un propósito para tu vida.';

  indiceActual = 0;
  animando = false;

  private intervalo?: ReturnType<typeof setInterval>;

  versiculos = [
    {
      referencia: 'Jeremías 31:3',
      texto: 'Con amor eterno te he amado.'
    },
    {
      referencia: '2 Corintios 6:2',
      texto: 'Ahora es el tiempo favorable; ahora es el día de salvación.'
    },
    {
      referencia: 'Juan 3:16',
      texto: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en Él cree no se pierda, mas tenga vida eterna.'
    },
    {
      referencia: 'Isaías 41:10',
      texto: 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo.'
    },
    {
      referencia: 'Mateo 11:28',
      texto: 'Vengan a mí todos los que están cansados y cargados, y yo los haré descansar.'
    }
  ];

  ngOnInit(): void {
    this.iniciarCarrusel();
  }

  private iniciarCarrusel(): void {

    if (this.intervalo) {
      clearInterval(this.intervalo);
    }

    this.intervalo = setInterval(() => {
      this.siguiente();
    }, 6000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  siguiente(): void {
    this.cambiarVersiculo(
      (this.indiceActual + 1) % this.versiculos.length
    );
  }

  anterior(): void {
    this.cambiarVersiculo(
      (this.indiceActual - 1 + this.versiculos.length) %
      this.versiculos.length
    );
  }

  irA(indice: number): void {
    this.cambiarVersiculo(indice);
  }

  private cambiarVersiculo(indice: number): void {

    if (this.animando) return;

    this.animando = true;
    this.indiceActual = indice;

    setTimeout(() => {
      this.animando = false;
    }, 400);

    this.iniciarCarrusel();
  }
}