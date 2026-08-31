import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';

const CONFIG_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQa8O7nOCaXJpSlIVswn9o4zOy7zIWPBijwc8TDhPx7VAMzFFmpQcqo0UkPHXcOAj6bgz2L0oyFw9_I/pub?gid=0&single=true&output=csv";
const USUARIOS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQa8O7nOCaXJpSlIVswn9o4zOy7zIWPBijwc8TDhPx7VAMzFFmpQcqo0UkPHXcOAj6bgz2L0oyFw9_I/pub?gid=948037030&single=true&output=csv";
const ESTUDIOS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQa8O7nOCaXJpSlIVswn9o4zOy7zIWPBijwc8TDhPx7VAMzFFmpQcqo0UkPHXcOAj6bgz2L0oyFw9_I/pub?gid=410435520&single=true&output=csv";
const RESPUESTAS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQa8O7nOCaXJpSlIVswn9o4zOy7zIWPBijwc8TDhPx7VAMzFFmpQcqo0UkPHXcOAj6bgz2L0oyFw9_I/pub?gid=1503286462&single=true&output=csv";
const REACCIONES_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQa8O7nOCaXJpSlIVswn9o4zOy7zIWPBijwc8TDhPx7VAMzFFmpQcqo0UkPHXcOAj6bgz2L0oyFw9_I/pub?gid=50102099&single=true&output=csv";
const LIBROS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQa8O7nOCaXJpSlIVswn9o4zOy7zIWPBijwc8TDhPx7VAMzFFmpQcqo0UkPHXcOAj6bgz2L0oyFw9_I/pub?gid=900325381&single=true&output=csv";

// TODO: pegá acá la URL de tu Apps Script desplegado (termina en /exec).
// Mirá las instrucciones en src/app/jovenes/backend/Code.gs
const GUARDAR_RESPUESTA_URL = "https://script.google.com/macros/s/AKfycbw9jD79Ocr2onvlZZZzeTXlYwkxte3TCcM8rn5ZZwssa1kEywAGDWxAQaRtqh0ubwWP/exec";

export interface RespuestaParaGuardar {
    estudio_id: number;
    texto: string;
    fecha: string;
}

@Injectable({
    providedIn: 'root'
})
export class JovenesService {

    constructor() { }

    private leerCSV(url: string): Promise<any[]> {

        return new Promise((resolve, reject) => {

            Papa.parse(url + "&t=" + Date.now(), {

                download: true,

                header: true,

                skipEmptyLines: true,

                complete: (resultado) => {

                    resolve(resultado.data as any[]);

                },

                error: (error) => {

                    reject(error);

                }

            });

        });

    }

    obtenerConfiguracion() {

        return this.leerCSV(CONFIG_URL);

    }

    obtenerUsuarios() {

        return this.leerCSV(USUARIOS_URL);

    }

    obtenerEstudios() {

        return this.leerCSV(ESTUDIOS_URL);

    }

    obtenerRespuestas() {

        return this.leerCSV(RESPUESTAS_URL);

    }

    obtenerReacciones() {

        return this.leerCSV(REACCIONES_URL);

    }

    obtenerLibros() {
        return this.leerCSV(LIBROS_URL);
    }

    async guardarRespuesta(datos: RespuestaParaGuardar): Promise<any> {

        const respuesta = await fetch(GUARDAR_RESPUESTA_URL, {
            method: 'POST',

            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },

            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            throw new Error(
                `Error HTTP: ${respuesta.status}`
            );
        }

        return await respuesta.json();
    }

}