import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';

const CONFIG_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa8O7nOCaXJpSlIVswn9o4zOy7zIWPBijwc8TDhPx7VAMzFFmpQcqo0UkPHXcOAj6bgz2L0oyFw9_I/pub?gid=0&single=true&output=csv';

const USUARIOS_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa8O7nOCaXJpSlIVswn9o4zOy7zIWPBijwc8TDhPx7VAMzFFmpQcqo0UkPHXcOAj6bgz2L0oyFw9_I/pub?gid=948037030&single=true&output=csv';

const ESTUDIOS_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa8O7nOCaXJpSlIVswn9o4zOy7zIWPBijwc8TDhPx7VAMzFFmpQcqo0UkPHXcOAj6bgz2L0oyFw9_I/pub?gid=410435520&single=true&output=csv';

const RESPUESTAS_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa8O7nOCaXJpSlIVswn9o4zOy7zIWPBijwc8TDhPx7VAMzFFmpQcqo0UkPHXcOAj6bgz2L0oyFw9_I/pub?gid=1503286462&single=true&output=csv';

const REACCIONES_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa8O7nOCaXJpSlIVswn9o4zOy7zIWPBijwc8TDhPx7VAMzFFmpQcqo0UkPHXcOAj6bgz2L0oyFw9_I/pub?gid=50102099&single=true&output=csv';

const LIBROS_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa8O7nOCaXJpSlIVswn9o4zOy7zIWPBijwc8TDhPx7VAMzFFmpQcqo0UkPHXcOAj6bgz2L0oyFw9_I/pub?gid=900325381&single=true&output=csv';

const GUARDAR_RESPUESTA_URL =
    'https://script.google.com/macros/s/AKfycbxENC9MSO_7Pq-OQvEZlnoFZVrS3G-jblIEr-oQaiG4Q7YgarmJGK6hC5QK2Z39GuHl/exec';

export interface RespuestaParaGuardar {
    estudio_id: number;
    texto: string;
    fecha: string;
}

interface CacheItem<T> {
    data: T;
    timestamp: number;
}

@Injectable({
    providedIn: 'root'
})
export class JovenesService {

    /**
     * Tiempo durante el cual consideramos válido el caché.
     * 5 minutos.
     */
    private readonly CACHE_TIME = 5 * 60 * 1000;

    /**
     * Requests actualmente en curso.
     *
     * Si dos partes de la aplicación piden el mismo CSV
     * al mismo tiempo, solamente hacemos una petición.
     */
    private requestsEnCurso = new Map<string, Promise<any[]>>();

    constructor() { }

    // =========================================================
    // CSV
    // =========================================================

    private descargarCSV(url: string): Promise<any[]> {

        return new Promise((resolve, reject) => {

            Papa.parse(url, {
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

    // =========================================================
    // CACHE
    // =========================================================

    private obtenerDelCache<T>(key: string): T | null {

        try {

            const guardado = localStorage.getItem(key);

            if (!guardado) {
                return null;
            }

            const cache: CacheItem<T> = JSON.parse(guardado);

            const expirado =
                Date.now() - cache.timestamp > this.CACHE_TIME;

            if (expirado) {
                return null;
            }

            return cache.data;

        } catch (error) {

            console.warn('No se pudo leer el cache:', key, error);

            return null;
        }
    }

    private guardarEnCache<T>(key: string, data: T): void {

        try {

            const cache: CacheItem<T> = {
                data,
                timestamp: Date.now()
            };

            localStorage.setItem(
                key,
                JSON.stringify(cache)
            );

        } catch (error) {

            console.warn('No se pudo guardar cache:', key, error);

        }
    }

    private eliminarCache(key: string): void {

        localStorage.removeItem(key);

    }

    // =========================================================
    // LECTOR INTELIGENTE
    // =========================================================

    private async leerCSV(
        url: string,
        cacheKey: string
    ): Promise<any[]> {

        // -------------------------------------------------------
        // 1. CACHE VÁLIDO
        // -------------------------------------------------------

        const cache = this.obtenerDelCache<any[]>(cacheKey);

        if (cache) {

            console.log('⚡ Cache utilizado:', cacheKey);

            /**
             * Actualización silenciosa.
             *
             * La aplicación NO espera esto.
             */
            this.actualizarEnSegundoPlano(url, cacheKey);

            return cache;
        }

        // -------------------------------------------------------
        // 2. SI YA HAY UNA PETICIÓN EN CURSO
        // -------------------------------------------------------

        const requestExistente =
            this.requestsEnCurso.get(cacheKey);

        if (requestExistente) {

            console.log(
                '♻️ Reutilizando request:',
                cacheKey
            );

            return requestExistente;
        }

        // -------------------------------------------------------
        // 3. DESCARGAR
        // -------------------------------------------------------

        const request = this.descargarCSV(url)
            .then(data => {

                console.log(
                    '🌐 Datos descargados:',
                    cacheKey
                );

                this.guardarEnCache(
                    cacheKey,
                    data
                );

                return data;

            })
            .finally(() => {

                this.requestsEnCurso.delete(cacheKey);

            });

        this.requestsEnCurso.set(
            cacheKey,
            request
        );

        return request;
    }

    // =========================================================
    // ACTUALIZACION SILENCIOSA
    // =========================================================

    private actualizarEnSegundoPlano(
        url: string,
        cacheKey: string
    ): void {

        /**
         * Si ya estamos actualizando ese recurso,
         * no hacemos otra petición.
         */
        if (this.requestsEnCurso.has(cacheKey)) {
            return;
        }

        const request = this.descargarCSV(url)
            .then(data => {

                console.log(
                    '🌐 Datos descargados:',
                    cacheKey
                );

                this.guardarEnCache(
                    cacheKey,
                    data
                );

                return data;

            })
            .finally(() => {

                this.requestsEnCurso.delete(cacheKey);

            });
    }

    // =========================================================
    // DATOS
    // =========================================================

    obtenerConfiguracion() {
        return this.leerCSV(
            CONFIG_URL,
            'jovenes_configuracion'
        );
    }

    obtenerUsuarios() {
        return this.leerCSV(
            USUARIOS_URL,
            'jovenes_usuarios'
        );
    }

    obtenerEstudios() {
        return this.leerCSV(
            ESTUDIOS_URL,
            'jovenes_estudios'
        );
    }

    obtenerRespuestas() {
        return this.leerCSV(
            RESPUESTAS_URL,
            'jovenes_respuestas'
        );
    }

    obtenerReacciones() {
        return this.leerCSV(
            REACCIONES_URL,
            'jovenes_reacciones'
        );
    }

    obtenerLibros() {
        return this.leerCSV(
            LIBROS_URL,
            'jovenes_libros'
        );
    }

    // =========================================================
    // INVALIDAR RESPUESTAS
    // =========================================================

    private invalidarRespuestas(): void {

        this.eliminarCache(
            'jovenes_respuestas'
        );

    }

    // =========================================================
    // GUARDAR RESPUESTA
    // =========================================================

    async guardarRespuesta(
        datos: RespuestaParaGuardar
    ): Promise<any> {

        const respuesta = await fetch(
            GUARDAR_RESPUESTA_URL,
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'text/plain;charset=utf-8'
                },

                body: JSON.stringify(datos)
            }
        );

        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP: ${respuesta.status}`
            );

        }

        const resultado = await respuesta.json();

        /**
         * La respuesta cambió en Google Sheets.
         *
         * Eliminamos el cache para que la próxima lectura
         * obtenga los datos nuevos.
         */
        this.invalidarRespuestas();

        return resultado;
    }
}