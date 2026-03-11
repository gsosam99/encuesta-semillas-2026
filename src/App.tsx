import React, { useState, useEffect, useMemo, useRef } from 'react';

// ============================================================
// TYPES
// ============================================================
interface Lote {
  l: string | number;
  h: number;
  f: string;
}

interface LoteResponse {
  lote: string;
  finca: string;
  ha: number;
  semilla: string;
  customSeed: string | null;
  tipo: 'DANAC' | 'Otros';
}

interface SubmissionData {
  lotes: LoteResponse[];
  totalHa: number;
  danacHa: number;
  danacPct: number;
  timestamp: string;
}

interface StoredResponse {
  producer: string;
  data: SubmissionData;
  updated_at?: string;
}

interface Stats {
  danacHa: number;
  otrosHa: number;
  danacPct: number;
  assigned: number;
  total: number;
  allDone: boolean;
}

interface SeedGroup {
  category: 'DANAC' | 'Otros';
  seeds: string[];
}

type AppMode = 'loading' | 'form' | 'admin' | 'notfound' | 'submitted';

// ============================================================
// DATA: All producers with their active lots
// ============================================================
const PRODUCERS_DATA: Record<string, Lote[]> = {
  'Celso Fantinel Furlanis': [
    { l: 'Costanero', h: 15.61, f: 'Agroveneta' },
    { l: 'La Ceiba', h: 30.46, f: 'Agroveneta' },
    { l: 'Taladro A', h: 14.7, f: 'Agroveneta' },
    { l: 'Frijolero Oeste', h: 17.19, f: 'Agroveneta' },
    { l: 'Taladro B', h: 13.53, f: 'Agroveneta' },
    { l: 'Punta gorda A', h: 19.58, f: 'Agroveneta' },
    { l: 'Guillero 1', h: 9.62, f: 'Agroveneta' },
    { l: 'Guillero 2', h: 31.59, f: 'Agroveneta' },
    { l: 'Guillero 3', h: 22.76, f: 'Agroveneta' },
  ],
  'Meiz Tohme Elchair': [
    { l: 'Cerro Blanco', h: 31.78, f: 'Buenavista' },
    { l: 'El Roble 2 + El Roble 3', h: 34.78, f: 'Buenavista' },
    { l: 'La Carretera 1', h: 21.41, f: 'Buenavista' },
    { l: 'El Roble 1', h: 13.84, f: 'Buenavista' },
    { l: 'La Carretera 2', h: 21.02, f: 'Buenavista' },
    { l: 'El Palmarital 1', h: 37.62, f: 'Buenavista' },
    { l: 'La Nueva 3', h: 19.45, f: 'Buenavista' },
    { l: 'El Palmarital 2', h: 24.05, f: 'Buenavista' },
    { l: 'El Palmarital 3', h: 24.43, f: 'Buenavista' },
    { l: 'La Cuca 1', h: 28.31, f: 'Buenavista' },
    { l: 'La Nueva 2', h: 29.3, f: 'Buenavista' },
    { l: 'El Palmarital 4', h: 14.3, f: 'Buenavista' },
    { l: 'Laguna Negra', h: 23.46, f: 'Buenavista' },
    { l: 'El Diablo 2', h: 14.94, f: 'Buenavista' },
    { l: 'La Nueva 1', h: 28.81, f: 'Buenavista' },
    { l: 'Las Yeguas', h: 33.24, f: 'Buenavista' },
    { l: 'La Cuca 2', h: 13.76, f: 'Buenavista' },
    { l: 'El Mamón', h: 41.86, f: 'Buenavista' },
    { l: 'El Diablo 1', h: 25.99, f: 'Buenavista' },
    { l: 'Caño el Loco 2', h: 26.29, f: 'Buenavista' },
    { l: 'Caño el Loco 1', h: 32.0, f: 'Buenavista' },
    { l: 'La Sociedad', h: 25.97, f: 'Buenavista' },
    { l: 'Los Caribes', h: 23.5, f: 'Buenavista' },
    { l: 'Los Palos 1', h: 24.55, f: 'Buenavista' },
    { l: 'Los Palos 2', h: 25.26, f: 'Buenavista' },
    { l: 'El Ataud', h: 51.55, f: 'Buena Vista' },
    { l: 'Las Novillas', h: 29.44, f: 'Buena Vista' },
    { l: 'Las Torres', h: 23.78, f: 'Buena Vista' },
  ],
  'Cesar Augusto Ledezma Mendez': [
    { l: 'Detrás de la Pista 1', h: 17.44, f: 'Pampas de Aragua' },
    { l: 'Detrás de la Pista 3', h: 16.75, f: 'Pampas de Aragua' },
    { l: 'Las Torres 1', h: 25.17, f: 'Pampas de Aragua' },
    { l: 'Las Torres 4', h: 18.59, f: 'Pampas de Aragua' },
    { l: 'Las Torres 3', h: 22.63, f: 'Pampas de Aragua' },
    { l: 'Orestes 1', h: 16.26, f: 'Pampas de Aragua' },
    { l: 'Las Torres 2', h: 24.37, f: 'Pampas de Aragua' },
    { l: 'Detrás de la Pista 2', h: 20.54, f: 'Pampas de Aragua' },
    { l: 'El Roble 2', h: 32.09, f: 'Pampas de Aragua' },
  ],
  'Juan Samuell Silveira Camacho': [
    { l: 'El Mamón 1', h: 17.3, f: 'Las Araguatas' },
    { l: 'El Mamón 3', h: 22.68, f: 'Las Araguatas' },
    { l: 'El Frente 2', h: 23.99, f: 'Las Araguatas' },
    { l: 'El Mamón 4', h: 10.67, f: 'Las Araguatas' },
    { l: 'El Virote 2', h: 27.78, f: 'Las Araguatas' },
    { l: 'El Virote1', h: 41.65, f: 'Las Araguatas' },
    { l: 'El Mamón 2', h: 8.2, f: 'Las Araguatas' },
    { l: 'El Frente 1', h: 21.76, f: 'Las Araguatas' },
    { l: 'El Frente 3', h: 32.69, f: 'Las Araguatas' },
    { l: 'Los Robles 1', h: 27.03, f: 'La Quinta' },
    { l: 'Los Robles 2', h: 21.27, f: 'La Quinta' },
    { l: 'Los Robles 3', h: 26.92, f: 'La Quinta' },
    { l: 'Casa de Chiquitin 1', h: 34.63, f: 'La Quinta' },
    { l: 'Casa de Chiquitin 2', h: 34.97, f: 'La Quinta' },
    { l: 'Casa de Chiquitin 3', h: 50.39, f: 'La Quinta' },
    { l: 'Casa de Chiquitin 4', h: 40.21, f: 'La Quinta' },
  ],
  'Jose Dario Gallucci Requena': [
    { l: 'El Trapiche 1', h: 28.54, f: 'Las Chaguaramitas' },
    { l: 'La Aguadita 2', h: 18.61, f: 'Las Chaguaramitas' },
    { l: 'Loma de Piedra 2', h: 23.76, f: 'Las Chaguaramitas' },
    { l: 'El Trapiche 2', h: 25.69, f: 'Las Chaguaramitas' },
    { l: 'Loma de Piedra 1', h: 21.89, f: 'Las Chaguaramitas' },
    { l: 'Chaparralito 1', h: 20.0, f: 'Las Chaguaramitas' },
    { l: 'Chaparralito 2', h: 22.72, f: 'Las Chaguaramitas' },
    { l: 'Chaparral 3', h: 18.95, f: 'Las Chaguaramitas' },
    { l: 'El Olivo 3', h: 21.29, f: 'Las Chaguaramitas' },
    { l: 'La Aguadita 1', h: 22.9, f: 'Las Chaguaramitas' },
    { l: 'Chaparral 2', h: 26.53, f: 'Las Chaguaramitas' },
    { l: 'Chaparral 1', h: 31.2, f: 'Las Chaguaramitas' },
    { l: 'Los Toros 2', h: 29.14, f: 'Las Chaguaramitas' },
    { l: 'El Olivo 2', h: 18.73, f: 'Las Chaguaramitas' },
    { l: 'El Olivo 1', h: 30.05, f: 'Las Chaguaramitas' },
    { l: 'Los Toros 1', h: 20.7, f: 'Las Chaguaramitas' },
    { l: 'La Aguadita 3', h: 24.31, f: 'Las Chaguaramitas' },
  ],
  'Leoscar Machado Silveira': [
    { l: 'La Casa 3', h: 25.23, f: 'Camilero' },
    { l: 'La Casa 4', h: 23.4, f: 'Camilero' },
    { l: 'La Casa 5', h: 29.88, f: 'Camilero' },
    { l: 'La Casa 1', h: 36.4, f: 'Camilero' },
    { l: 'La Casa 2', h: 25.65, f: 'Camilero' },
    { l: 'La Pista 1', h: 24.26, f: 'Camilero' },
    { l: 'La Pista 2', h: 24.3, f: 'Camilero' },
  ],
  'Juan Vicente Risso': [
    { l: 'El Trailer 2', h: 27.71, f: 'Juan Hilario' },
    { l: 'El Trailer 4', h: 16.86, f: 'Juan Hilario' },
    { l: 'El Trailer 5', h: 13.27, f: 'Juan Hilario' },
    { l: 'Julio 1', h: 35.81, f: 'Juan Hilario' },
    { l: 'Julio 2', h: 20.6, f: 'Juan Hilario' },
    { l: 'El Trailer 1', h: 32.15, f: 'Juan Hilario' },
    { l: 'Julio 3', h: 24.75, f: 'Juan Hilario' },
    { l: 'El Trailer 3', h: 31.99, f: 'Juan Hilario' },
    { l: 'Cosechadora quemada 1', h: 23.91, f: 'Juan Hilario' },
    { l: 'Cosechadora quemada 2', h: 34.84, f: 'Juan Hilario' },
    { l: 'Cosechadora quemada 3', h: 26.85, f: 'Juan Hilario' },
    { l: 'Cosechadora quemada 4', h: 25.54, f: 'Juan Hilario' },
    { l: 'Cosechadora quemada 5', h: 17.31, f: 'Juan Hilario' },
    { l: 'Cosechadora quemada 6', h: 23.7, f: 'Juan Hilario' },
    { l: 'Detrás del galpón 1', h: 24.59, f: 'Juan Hilario' },
    { l: 'Detrás del galpón 2', h: 23.64, f: 'Juan Hilario' },
    { l: 'Detrás del galpón 3', h: 25.28, f: 'Juan Hilario' },
    { l: 'Leo 1', h: 26.75, f: 'Juan Hilario' },
    { l: 'Leo 2', h: 31.65, f: 'Juan Hilario' },
    { l: 'Leo 3', h: 24.96, f: 'Juan Hilario' },
    { l: 'Leo 4', h: 19.11, f: 'Juan Hilario' },
    { l: 'Los Ciruelos 1', h: 26.23, f: 'Juan Hilario' },
    { l: 'Los Ciruelos 2', h: 34.55, f: 'Juan Hilario' },
    { l: 'Los Ciruelos 3', h: 30.4, f: 'Juan Hilario' },
    { l: 'Los Ciruelos 4', h: 27.49, f: 'Juan Hilario' },
  ],
  'Jose Rolando Caldera Rondon': [
    { l: 'La Palmita 2', h: 29.51, f: 'La Graciosa' },
    { l: 'Los Morochos 1', h: 31.87, f: 'La Graciosa' },
    { l: 'Los Morochos 2', h: 39.35, f: 'La Graciosa' },
    { l: 'La Palmita 1', h: 15.23, f: 'La Graciosa' },
    { l: 'El Porvenir', h: 39.15, f: 'La Graciosa' },
    { l: 'Magallanes', h: 35.39, f: 'La Graciosa' },
  ],
  'Jose Rolando Caldera Alveraiz': [
    { l: 'La Unión', h: 91.9, f: 'San Pedro' },
    { l: 'Los Muertos', h: 77.35, f: 'San Pedro' },
    { l: 'Portón Azul', h: 24.51, f: 'San Pedro' },
    { l: 'Laguna Grande', h: 35.33, f: 'San Pedro' },
  ],
  'Luis Alberto Rojas Pieretti': [
    { l: 'El Galpón 2', h: 16.64, f: 'Los Espinitos' },
    { l: 'El Galpón 6', h: 35.06, f: 'Los Espinitos' },
    { l: 'El Galpón 3', h: 24.17, f: 'Los Espinitos' },
    { l: 'El Galpón 1', h: 23.28, f: 'Los Espinitos' },
    { l: 'El Galpón 4', h: 12.41, f: 'Los Espinitos' },
    { l: 'El Galpón 5', h: 15.41, f: 'Los Espinitos' },
    { l: 'El Muerto', h: 32.53, f: 'Los Espinitos' },
  ],
  'Ezequiel Jose Fontiveros Briceño': [
    { l: 'El Drago', h: 23.65, f: 'Don Fonti' },
    { l: 'Candirosa - Mango A', h: 16.8, f: 'Don Fonti' },
    { l: 'Girasol', h: 25.43, f: 'Santa Clara' },
    { l: 'Guinea', h: 7.33, f: 'Santa Clara' },
    { l: 'Candirosa - Mango B', h: 17.25, f: 'Don Fonti' },
    { l: 'La Ceiba B', h: 12.09, f: 'Santa Clara' },
    { l: 'Tamarindo', h: 12.55, f: 'Don Fonti' },
    { l: 'La Ceiba A', h: 12.51, f: 'Santa Clara' },
    { l: 'Los Viejos B', h: 14.26, f: 'Santa Clara' },
    { l: 'Los Viejos A', h: 16.82, f: 'Santa Clara' },
    { l: 'Candilero', h: 17.23, f: 'Don Fonti' },
    { l: 'La Batea', h: 8.28, f: 'Santa Clara' },
    { l: 'El Mamon', h: 9.38, f: 'Santa Clara' },
  ],
  'Tony Alejandro Pestana Perez': [
    { l: 'Las 14', h: 13.4, f: 'Monteluna' },
    { l: 'Las 10', h: 9.76, f: 'Monteluna' },
    { l: 'Las 36', h: 34.67, f: 'Monteluna' },
    { l: 'Las 25', h: 25.61, f: 'Monteluna' },
    { l: 'Las 6 + 1,7 + 0,4', h: 8.01, f: 'Monteluna' },
    { l: 'Las 12', h: 11.68, f: 'Monteluna' },
    { l: 'Las 30', h: 28.1, f: 'Monteluna' },
    { l: 'Las 40', h: 38.49, f: 'Monteluna' },
    { l: 'Las 15', h: 13.24, f: 'Monteluna' },
  ],
  'Luigi Donello Tognetti': [
    { l: 'Parcela 170 A', h: 14.42, f: 'La Colina' },
    { l: 'Parcela 170 B', h: 15.23, f: 'La Colina' },
  ],
  'Miguel Ángel Tohme Ledezma': [
    { l: 'El Pablitero', h: 19.49, f: 'Las Margaritas' },
    { l: 'La Isla 1', h: 32.58, f: 'Las Margaritas' },
    { l: 'La Isla 2', h: 38.66, f: 'Las Margaritas' },
    { l: 'La Antena 1', h: 20.64, f: 'Las Margaritas' },
    { l: 'La Antena 2', h: 25.52, f: 'Las Margaritas' },
    { l: 'La Viuda 1', h: 22.8, f: 'Las Margaritas' },
    { l: 'La Viuda 2', h: 24.62, f: 'Las Margaritas' },
    { l: 'La Viuda 3', h: 17.65, f: 'Las Margaritas' },
    { l: 'La Viuda 4', h: 28.06, f: 'Las Margaritas' },
    { l: 'La Viuda 5', h: 24.23, f: 'Las Margaritas' },
    { l: 'La Viuda 6', h: 23.09, f: 'Las Margaritas' },
    { l: 'La Viuda 7', h: 26.53, f: 'Las Margaritas' },
    { l: 'La Bodega 1', h: 19.02, f: 'Las Margaritas' },
    { l: 'La Bodega 2', h: 16.8, f: 'Las Margaritas' },
  ],
  'Manuel José González Gómez': [
    { l: 'Laguna Verde 1', h: 34.49, f: 'Cebruno' },
    { l: 'Laguna Verde 2', h: 32.27, f: 'Cebruno' },
    { l: 'Laguna Verde 3', h: 19.16, f: 'Cebruno' },
    { l: 'Laguna Verde 4', h: 23.16, f: 'Cebruno' },
    { l: 'El Pañuelo 1', h: 35.56, f: 'La Chacra' },
    { l: 'El Pañuelo 2', h: 27.27, f: 'La Chacra' },
  ],
  'Maria Angelica Esparragoza Salazar': [
    { l: 'Los Vaquiros 1', h: 24.28, f: 'El Almirante' },
    { l: 'Los Vaquiros 2', h: 23.37, f: 'El Almirante' },
    { l: 'Los Reyes 1', h: 33.95, f: 'El Almirante' },
    { l: 'Los Reyes 2', h: 37.22, f: 'El Almirante' },
    { l: 'Los Reyes 3', h: 20.24, f: 'El Almirante' },
    { l: 'Los Reyes 4', h: 22.47, f: 'El Almirante' },
    { l: 'Los Reyes 5', h: 29.17, f: 'El Almirante' },
  ],
  'Francisco Enrique González Roselli': [
    { l: 'Locación A', h: 12.83, f: 'El Apamate' },
    { l: 'Locación B', h: 25.64, f: 'El Apamate' },
    { l: 'Ramírez', h: 60.63, f: 'El Apamate' },
    { l: 'Mata e Palo', h: 37.05, f: 'El Apamate' },
    { l: 'Bajo e la Loma', h: 33.61, f: 'El Apamate' },
    { l: 'La Loma', h: 14.48, f: 'El Apamate' },
    { l: 'La Piedra', h: 18.15, f: 'El Apamate' },
  ],
  'Antonio Luis Zambrano Acuña': [
    { l: 'Molino Escabezao 1', h: 26.14, f: 'San Pedro' },
    { l: 'Molino Escabezao 2', h: 26.53, f: 'San Pedro' },
    { l: 'Molino Escabezao 3', h: 23.11, f: 'San Pedro' },
    { l: 'Molino Escabezao 4', h: 18.63, f: 'San Pedro' },
    { l: 'Tanque Gasoil 1', h: 22.87, f: 'San Pedro' },
    { l: 'Tanque Gasoil 2', h: 24.97, f: 'San Pedro' },
    { l: 'Casa de Tabla A', h: 21.77, f: 'San Pedro' },
    { l: 'Casa de Tabla B', h: 23.57, f: 'San Pedro' },
    { l: 'El Desquite A', h: 26.68, f: 'San Pedro' },
    { l: 'El Desquite B', h: 22.76, f: 'San Pedro' },
  ],
  'Juan Hernández Díaz': [
    { l: 'Tomate 1-1', h: 24.08, f: 'Vilereña' },
    { l: 'Tomate 1-2', h: 23.35, f: 'Vilereña' },
    { l: 'Tomate 2-1', h: 22.75, f: 'Vilereña' },
    { l: 'Tomate 2-2', h: 24.36, f: 'Vilereña' },
    { l: 'La Zorra 1', h: 22.53, f: 'Vilereña' },
    { l: 'La Zorra 2', h: 29.78, f: 'Vilereña' },
    { l: 'Trinchera de Corcovado A1', h: 33.94, f: 'Vilereña' },
    { l: 'Trinchera de Corcovado A2', h: 37.43, f: 'Vilereña' },
    { l: 'Trinchera de Corcovado B1', h: 40.0, f: 'Vilereña' },
    { l: 'Trinchera de Corcovado B2', h: 36.09, f: 'Vilereña' },
    { l: 'El Carito 1-1', h: 27.28, f: 'Vilereña' },
    { l: 'El Carito 1-2', h: 21.44, f: 'Vilereña' },
    { l: 'Pegado a Pepe 1', h: 22.68, f: 'Vilereña' },
    { l: 'Pegado a Pepe 2', h: 17.25, f: 'Vilereña' },
    { l: 'Eleodoro 1', h: 33.15, f: 'Vilereña' },
    { l: 'Eleodoro 2', h: 32.99, f: 'Vilereña' },
    { l: 'La Casa 1-1', h: 25.88, f: 'Vilereña' },
    { l: 'Trinchera de Llano Adentro', h: 31.63, f: 'Vilereña' },
  ],
  'Francisco Jose Márquez': [
    { l: 'Rogelio Pequeño', h: 13.11, f: 'Juan Francisco' },
    { l: 'Rogelio Grande', h: 22.35, f: 'Juan Francisco' },
    { l: 'La Ceiba', h: 23.03, f: 'Juan Francisco' },
    { l: 'Juan', h: 9.35, f: 'Juan Francisco' },
    { l: 'La Platanera', h: 16.33, f: 'Juan Francisco' },
    { l: 'Bancales Viejos', h: 20.83, f: 'Juan Francisco' },
    { l: 'La Rafaeleña', h: 16.63, f: 'Juan Francisco' },
  ],
  'Henry Jose Cordones Linarez': [
    { l: 'La Victoria 1', h: 7.44, f: 'La Victoria' },
    { l: 'La Victoria 2', h: 6.87, f: 'La Victoria' },
    { l: 'La Victoria 3', h: 19.08, f: 'La Victoria' },
    { l: 'La Victoria 4', h: 7.75, f: 'La Victoria' },
    { l: 'Santa Barbara 1', h: 18.55, f: 'Santa Barbara' },
    { l: 'Santa Barbara 2', h: 14.56, f: 'Santa Barbara' },
  ],
  'Dennis Leonardo Alibardi Maschio': [
    { l: 'Lote 5', h: 15.83, f: 'Agropecuaria Alma' },
    { l: 'Lote 4', h: 19.9, f: 'Agropecuaria Alma' },
    { l: 'Lote 1', h: 14.09, f: 'Agropecuaria Alma' },
    { l: 'Lote 2', h: 15.75, f: 'Agropecuaria Alma' },
    { l: 'Lote 3', h: 16.28, f: 'Agropecuaria Alma' },
    { l: '35 A', h: 17.16, f: 'Agropecuaria Alma' },
    { l: '35 B', h: 15.92, f: 'Agropecuaria Alma' },
    { l: 'Fabiana', h: 34.66, f: 'Agropecuaria Alma' },
    { l: 'La Laguna', h: 27.9, f: 'Agropecuaria Alma' },
    { l: 'La Mora 1', h: 18.23, f: 'Agropecuaria Alma' },
    { l: 'La Mora 2', h: 25.31, f: 'Agropecuaria Alma' },
  ],
  'Eduardo Manuel Mosquera Morillo': [
    { l: 'Ovigres 1', h: 27.0, f: 'Ovigres' },
    { l: 'Ovigres 2', h: 16.6, f: 'Ovigres' },
    { l: 'Ovigres 3', h: 12.82, f: 'Ovigres' },
    { l: 'Ovigres 4', h: 17.63, f: 'Ovigres' },
  ],
  'Carlo Antonio Delfin Carmona': [
    { l: 'El Potrero', h: 7.03, f: 'Las Flores' },
    { l: 'La Alcatarilla', h: 24.91, f: 'Las Flores' },
    { l: 'La Arena', h: 28.21, f: 'Las Flores' },
    { l: 'Los Samancitos', h: 26.12, f: 'Las Flores' },
    { l: 'La Casa', h: 27.12, f: 'Las Flores' },
  ],
  'Julio Antonio Colmenarez Mendoza': [
    { l: 'Revilla 1', h: 26.44, f: 'Revilla' },
    { l: 'Revilla 2', h: 16.19, f: 'Revilla' },
    { l: 'Revilla 3', h: 13.19, f: 'Revilla' },
    { l: 'Revilla 4', h: 12.41, f: 'Revilla' },
    { l: 'Revilla 5', h: 24.07, f: 'Revilla' },
    { l: 'Revilla 6', h: 9.03, f: 'Revilla' },
    { l: 'Revilla 7', h: 9.7, f: 'Revilla' },
    { l: 'Revilla 8', h: 10.6, f: 'Revilla' },
    { l: 'Los Pepes 1', h: 23.7, f: 'Los Pepes' },
    { l: 'Los Pepes 2', h: 29.3, f: 'Los Pepes' },
    { l: 'Los Pepes 3', h: 8.78, f: 'Los Pepes' },
    { l: 'Pelo e Mula 1', h: 27.13, f: 'Pelo e Mula' },
    { l: 'Pelo e Mula 2', h: 24.0, f: 'Pelo e Mula' },
    { l: 'La Ceiba', h: 20.6, f: 'La Llovizna' },
    { l: 'La Mariera 1', h: 30.72, f: 'La Llovizna' },
    { l: 'La Mariera 2', h: 30.16, f: 'La Llovizna' },
    { l: 'El Tanque', h: 16.81, f: 'La Llovizna' },
    { l: 'El Guasimo', h: 28.71, f: 'La Llovizna' },
  ],
  'Cesar Igor Padilla Martinez': [
    { l: 'La Padillera 1', h: 24.78, f: 'La Padillera' },
    { l: 'La Padillera 2', h: 16.54, f: 'La Padillera' },
    { l: 'Las Coromoticos 1', h: 6.78, f: 'La Padillera' },
    { l: 'Las Coromoticos 2', h: 6.24, f: 'La Padillera' },
    { l: 'Los Manguitos', h: 29.86, f: 'La Padillera' },
  ],
  'Elisa Bustamante': [
    { l: 'Dugarte 1', h: 22.31, f: 'Agropecuaria Dos Caminos' },
    { l: 'Dugarte 2', h: 23.33, f: 'Agropecuaria Dos Caminos' },
    { l: 'Dugarte 3', h: 24.31, f: 'Agropecuaria Dos Caminos' },
    { l: 'Dugarte 4', h: 25.01, f: 'Agropecuaria Dos Caminos' },
    { l: 'Las Niveladas 1', h: 25.44, f: 'Agropecuaria Dos Caminos' },
    { l: 'Las Niveladas 2', h: 32.24, f: 'Agropecuaria Dos Caminos' },
    { l: 'Las Niveladas 3', h: 24.58, f: 'Agropecuaria Dos Caminos' },
    { l: 'Las Niveladas 4', h: 25.75, f: 'Agropecuaria Dos Caminos' },
  ],
  'Lorena Johana Orlando Testi': [
    { l: 'Parcela 212', h: 20.82, f: 'Parcela 212' },
    { l: 'Parcela 246', h: 32.78, f: 'Parcela 246' },
    { l: 'Parcela 273', h: 31.97, f: 'Parcela 273' },
  ],
  'Sebastian Bonet': [
    { l: '7A', h: 20.22, f: '' },
    { l: '7B', h: 29.71, f: '' },
    { l: '7C', h: 25.64, f: '' },
    { l: '8', h: 69.85, f: '' },
  ],
  'Angela Rosa Guedez Morales': [
    { l: 'Villa Marina 1', h: 25.63, f: '' },
    { l: 'Villa Marina 2', h: 20.08, f: '' },
    { l: 'Lote 1A', h: 26.53, f: '' },
    { l: 'Lote 1B', h: 33.3, f: '' },
    { l: 'Lote 4', h: 26.31, f: '' },
    { l: 'Lote 5', h: 14.56, f: '' },
    { l: 'Lote 6', h: 9.19, f: '' },
    { l: 'Lote 7', h: 7.89, f: '' },
    { l: 'Lote 8', h: 17.74, f: '' },
    { l: 'Lote 9', h: 32.09, f: '' },
  ],
  'Ramon Eugenio Arruebarrena Garofalo': [
    { l: 'Barbascal 1', h: 33.61, f: '' },
    { l: 'Barbascal 2', h: 33.63, f: '' },
    { l: 'Barbascal 3', h: 20.11, f: '' },
    { l: 'Barbascal 4', h: 33.49, f: '' },
  ],
  'Wolfgang Steger': [
    { l: 'Parcela 64', h: 24.27, f: '' },
    { l: 'Parcela 62', h: 22.24, f: '' },
    { l: 'El Indio', h: 27.7, f: '' },
    { l: 'El Arenero', h: 29.93, f: '' },
    { l: 'Las 28', h: 28.74, f: '' },
    { l: 'Las 19', h: 18.14, f: '' },
    { l: 'Las 17', h: 17.52, f: '' },
    { l: 'Frente al pozo 1', h: 17.62, f: '' },
    { l: 'Frente al pozo 2', h: 32.31, f: '' },
    { l: 'Las 120 del frente 1', h: 45.16, f: '' },
    { l: 'Las 120 del frente 2', h: 32.36, f: '' },
    { l: 'Las 120 del frente 3', h: 24.91, f: '' },
    { l: 'Las 15', h: 14.27, f: '' },
    { l: 'Las 80 de atrás 1', h: 31.99, f: '' },
    { l: 'Las 80 de atrás 2', h: 33.73, f: '' },
    { l: 'Las 80 de atrás 3', h: 16.31, f: '' },
  ],
  'Héctor Pérez': [
    { l: 'Las Caraotas', h: 13.36, f: '' },
    { l: 'La Huesera', h: 12.91, f: '' },
    { l: 'El Mamón', h: 13.92, f: '' },
    { l: 'Mariecito', h: 24.0, f: '' },
    { l: 'Luisa', h: 7.2, f: '' },
    { l: 'La Cochinera', h: 8.03, f: '' },
  ],
  'Virbel Griman': [
    { l: 'El Manguito 1', h: 23.06, f: '' },
    { l: 'El Manguito 2', h: 11.3, f: '' },
    { l: 'El Manguito 3', h: 11.2, f: '' },
    { l: 'La Rosa', h: 14.49, f: '' },
    { l: 'Pavi 1', h: 11.24, f: '' },
    { l: 'Pavi 2', h: 11.39, f: '' },
    { l: 'La Silvera', h: 23.29, f: '' },
    { l: 'Lote de Arriba', h: 11.74, f: '' },
  ],
};

// ============================================================
// TOKEN MAP: unique short tokens per producer
// ============================================================
const PRODUCER_TOKENS: Record<string, string> = {};
const TOKEN_TO_PRODUCER: Record<string, string> = {};
(() => {
  Object.keys(PRODUCERS_DATA).forEach((name: string, i: number) => {
    let hash = 0;
    for (let c = 0; c < name.length; c++)
      hash = ((hash << 5) - hash + name.charCodeAt(c)) | 0;
    const token = 'p' + Math.abs(hash).toString(36) + i.toString(36);
    PRODUCER_TOKENS[name] = token;
    TOKEN_TO_PRODUCER[token] = name;
  });
})();

// ============================================================
// SEED OPTIONS
// ============================================================
const DANAC_SEEDS: string[] = ['D-029', 'D-025', 'D-430'];
const OTHER_SEEDS: string[] = ['Dekalb 410', 'Dekalb 6018'];
const SEED_OPTIONS: SeedGroup[] = [
  { category: 'DANAC', seeds: DANAC_SEEDS },
  { category: 'Otros', seeds: OTHER_SEEDS },
];

// ============================================================
// SUPABASE — Replace these two values after setup
// ============================================================
const SUPABASE_URL: string = 'https://etcfavwiunpipzommgfj.supabase.co';
const SUPABASE_ANON_KEY: string =
  'sb_publishable_0g-C7JGuHUAtmUvia43FPg_EpbRCUzr';

async function supabaseInsert(
  producer: string,
  data: SubmissionData
): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/respuestas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        producer,
        data,
        updated_at: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function supabaseFetchAll(): Promise<StoredResponse[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/respuestas?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (res.ok) return (await res.json()) as StoredResponse[];
  } catch {}
  return null;
}

// ============================================================
// COMPONENTS
// ============================================================
interface ProgressRingProps {
  percentage: number;
  size?: number;
  stroke?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 86,
  stroke = 7,
}) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(percentage, 100) / 100) * circ;
  const color =
    percentage >= 70 ? '#16a34a' : percentage >= 50 ? '#d97706' : '#dc2626';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#f3f4f6"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'all 0.5s ease' }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          transform: 'rotate(90deg)',
          transformOrigin: 'center',
          fontSize: size * 0.22,
          fontWeight: 800,
          fill: color,
        }}
      >
        {percentage.toFixed(1)}%
      </text>
    </svg>
  );
};

interface SeedSelectorProps {
  value: string;
  customValue?: string;
  onChange: (seed: string) => void;
  onCustomChange: (val: string) => void;
  zIndex: number;
}

const SeedSelector: React.FC<SeedSelectorProps> = ({
  value,
  customValue,
  onChange,
  onCustomChange,
  zIndex,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const isDanac = DANAC_SEEDS.includes(value);
  const cat: 'DANAC' | 'Otros' | null = isDanac
    ? 'DANAC'
    : value
      ? 'Otros'
      : null;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: 'relative', zIndex: open ? 9999 : zIndex }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '11px 14px',
          border: `2px solid ${cat === 'DANAC' ? '#22c55e' : cat === 'Otros' ? '#f59e0b' : '#e5e7eb'}`,
          borderRadius: 10,
          background:
            cat === 'DANAC' ? '#f0fdf4' : cat === 'Otros' ? '#fffbeb' : '#fff',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'inherit',
          fontSize: 14,
          color: '#1f2937',
          transition: 'all 0.2s',
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value === 'Otro (especificar)' && customValue
            ? customValue
            : value || 'Seleccionar semilla...'}
        </span>
        <span
          style={{ fontSize: 10, opacity: 0.4, flexShrink: 0, marginLeft: 8 }}
        >
          {open ? '▲' : '▼'}
        </span>
      </button>
      {cat && (
        <span
          style={{
            position: 'absolute',
            top: -9,
            right: 12,
            background: cat === 'DANAC' ? '#16a34a' : '#d97706',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 10px',
            borderRadius: 20,
            letterSpacing: 0.5,
          }}
        >
          {cat}
        </span>
      )}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: 12,
            boxShadow: '0 20px 60px rgba(0,0,0,0.28)',
            maxHeight: 280,
            overflowY: 'auto',
            zIndex: 99999,
          }}
        >
          {SEED_OPTIONS.map((g: SeedGroup) => (
            <div key={g.category}>
              <div
                style={{
                  padding: '9px 14px',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  color: g.category === 'DANAC' ? '#16a34a' : '#d97706',
                  background: g.category === 'DANAC' ? '#f0fdf4' : '#fffbeb',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  borderBottom: `1px solid ${g.category === 'DANAC' ? '#dcfce7' : '#fef3c7'}`,
                }}
              >
                {g.category === 'DANAC' ? '🌿 DANAC' : '📦 Otros'}
              </div>
              {g.seeds.map((seed: string) => (
                <div
                  key={seed}
                  onClick={() => {
                    onChange(seed);
                    setOpen(false);
                  }}
                  style={{
                    padding: '11px 14px',
                    cursor: 'pointer',
                    fontSize: 14,
                    background:
                      value === seed
                        ? g.category === 'DANAC'
                          ? '#dcfce7'
                          : '#fef3c7'
                        : 'transparent',
                    borderBottom: '1px solid #f9fafb',
                    transition: 'background 0.1s',
                    fontWeight: value === seed ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (value !== seed)
                      (e.currentTarget as HTMLDivElement).style.background =
                        '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      value === seed
                        ? g.category === 'DANAC'
                          ? '#dcfce7'
                          : '#fef3c7'
                        : 'transparent';
                  }}
                >
                  {value === seed && <span style={{ marginRight: 6 }}>✓</span>}
                  {seed}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {value === 'Otro (especificar)' && (
        <input
          type="text"
          placeholder="Escriba el nombre de la semilla..."
          value={customValue || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onCustomChange(e.target.value)
          }
          style={{
            marginTop: 8,
            width: '100%',
            padding: '9px 12px',
            border: '2px solid #f59e0b',
            borderRadius: 8,
            fontSize: 13,
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />
      )}
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('loading');
  const [producerName, setProducerName] = useState<string>('');
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [customSeeds, setCustomSeeds] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [allResponses, setAllResponses] = useState<StoredResponse[]>([]);
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [copied, setCopied] = useState<string>('');

  const loadAll = async (): Promise<void> => {
    const remote = await supabaseFetchAll();
    if (remote) {
      setAllResponses(remote);
      return;
    }
  };

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'admin') {
      loadAll().then(() => setMode('admin'));
    } else if (hash && TOKEN_TO_PRODUCER[hash]) {
      setProducerName(TOKEN_TO_PRODUCER[hash]);
      setMode('form');
    } else if (hash) {
      setMode('notfound');
    } else {
      setMode('admin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lotes: Lote[] = producerName ? PRODUCERS_DATA[producerName] || [] : [];
  const totalHa: number = lotes.reduce((s, l) => s + l.h, 0);

  const stats: Stats = useMemo(() => {
    let danacHa = 0,
      otrosHa = 0,
      assigned = 0;
    lotes.forEach((lot) => {
      const s = selections[String(lot.l)];
      if (s) {
        assigned++;
        if (DANAC_SEEDS.includes(s)) danacHa += lot.h;
        else otrosHa += lot.h;
      }
    });
    return {
      danacHa,
      otrosHa,
      danacPct: totalHa > 0 ? (danacHa / totalHa) * 100 : 0,
      assigned,
      total: lotes.length,
      allDone: assigned === lotes.length,
    };
  }, [selections, lotes, totalHa]);

  const canSubmit: boolean = stats.allDone && stats.danacPct >= 70;

  const handleSubmit = async (): Promise<void> => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    const data: SubmissionData = {
      lotes: lotes.map((l) => ({
        lote: String(l.l),
        finca: l.f,
        ha: l.h,
        semilla: selections[String(l.l)],
        customSeed: customSeeds[String(l.l)] || null,
        tipo: DANAC_SEEDS.includes(selections[String(l.l)]) ? 'DANAC' : 'Otros',
      })),
      totalHa,
      danacHa: stats.danacHa,
      danacPct: stats.danacPct,
      timestamp: new Date().toISOString(),
    };
    await supabaseInsert(producerName, data);
    setSubmitting(false);
    setMode('submitted');
  };

  const exportCSV = (): void => {
    let csv =
      '\uFEFF' +
      'Productor,Lote Muestreo,Finca,Superficie (Ha),Semilla,Tipo,Personalizada,% DANAC,Fecha\n';
    allResponses.forEach((r) => {
      const d = r.data;
      (d.lotes || []).forEach((lot) => {
        csv += `"${r.producer}","${lot.lote}","${lot.finca}",${lot.ha},"${lot.semilla}","${lot.tipo}","${lot.customSeed || ''}",${(d.danacPct || 0).toFixed(1)},"${d.timestamp || ''}"\n`;
      });
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' })
    );
    a.download = 'encuesta_semillas.csv';
    a.click();
  };

  const copyLink = (token: string): void => {
    const base = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(`${base}#${token}`);
    setCopied(token);
    setTimeout(() => setCopied(''), 2000);
  };

  // ============================================================
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(160deg,#f0fdf4 0%,#fafbfc 50%,#fffbeb 100%)',
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px}
      `}</style>

      {/* HEADER */}
      <div
        style={{
          background:
            'linear-gradient(135deg,#14532d 0%,#166534 40%,#4d7c0f 100%)',
          padding: '22px 20px 16px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -50,
            right: -30,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🌾</span>
            <h1
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 21,
                fontWeight: 800,
              }}
            >
              Encuesta de Semillas
            </h1>
          </div>
          {mode === 'form' && (
            <p style={{ fontSize: 13, opacity: 0.8, marginTop: 3 }}>
              Selección de semilla por Lote Muestreo
            </p>
          )}
          {mode === 'admin' && (
            <p style={{ fontSize: 13, opacity: 0.8, marginTop: 3 }}>
              Panel de administración
            </p>
          )}
        </div>
      </div>

      <div
        style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px 100px' }}
      >
        {mode === 'loading' && (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div
              style={{
                width: 36,
                height: 36,
                border: '4px solid #e5e7eb',
                borderTopColor: '#16a34a',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
                margin: '0 auto 12px',
              }}
            />
          </div>
        )}

        {mode === 'notfound' && (
          <div
            style={{
              textAlign: 'center',
              padding: 80,
              animation: 'fadeIn 0.4s',
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: '#1f2937',
                marginBottom: 8,
              }}
            >
              Enlace no válido
            </h2>
            <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6 }}>
              Este enlace no corresponde a ningún productor registrado.
              <br />
              Verifique el enlace que le fue compartido.
            </p>
          </div>
        )}

        {/* =================== FORM =================== */}
        {mode === 'form' && (
          <div style={{ animation: 'fadeIn 0.4s' }}>
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 22,
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 14,
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: '#1f2937',
                      marginBottom: 4,
                    }}
                  >
                    {producerName}
                  </h2>
                  <div
                    style={{
                      display: 'flex',
                      gap: 14,
                      fontSize: 13,
                      color: '#6b7280',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>📍 {lotes.length} lotes</span>
                    <span>📐 {totalHa.toFixed(2)} Ha</span>
                    <span>
                      ✅ {stats.assigned}/{stats.total}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: '#6b7280',
                      marginTop: 10,
                      lineHeight: 1.5,
                    }}
                  >
                    Asigne un tipo de semilla a cada lote. Mínimo{' '}
                    <strong style={{ color: '#166534' }}>70%</strong> de su
                    superficie debe ser{' '}
                    <strong style={{ color: '#166534' }}>DANAC</strong>.
                  </p>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <ProgressRing percentage={stats.danacPct} />
                  <div
                    style={{
                      fontSize: 11,
                      color: '#6b7280',
                      marginTop: 2,
                      fontWeight: 700,
                    }}
                  >
                    DANAC
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 14,
                  background: '#f9fafb',
                  borderRadius: 10,
                  padding: '12px 16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))',
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#9ca3af',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Ha DANAC
                  </div>
                  <div
                    style={{ fontSize: 18, fontWeight: 800, color: '#16a34a' }}
                  >
                    {stats.danacHa.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#9ca3af',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Ha Otros
                  </div>
                  <div
                    style={{ fontSize: 18, fontWeight: 800, color: '#d97706' }}
                  >
                    {stats.otrosHa.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#9ca3af',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Mín. DANAC
                  </div>
                  <div
                    style={{ fontSize: 18, fontWeight: 800, color: '#374151' }}
                  >
                    {(totalHa * 0.7).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#9ca3af',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Máx. Otros
                  </div>
                  <div
                    style={{ fontSize: 18, fontWeight: 800, color: '#374151' }}
                  >
                    {(totalHa * 0.3).toFixed(2)}
                  </div>
                </div>
              </div>
              {stats.allDone && stats.danacPct < 70 && (
                <div
                  style={{
                    marginTop: 12,
                    padding: '10px 14px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 10,
                    fontSize: 13,
                    color: '#dc2626',
                    fontWeight: 500,
                  }}
                >
                  ⛔ DANAC: {stats.danacPct.toFixed(1)}% — necesita{' '}
                  {(totalHa * 0.7 - stats.danacHa).toFixed(2)} Ha más para
                  alcanzar 70%.
                </div>
              )}
            </div>

            {lotes.map((lot: Lote, i: number) => {
              const k = String(lot.l);
              const seed = selections[k];
              const isDanac = DANAC_SEEDS.includes(seed);
              return (
                <div
                  key={k}
                  style={{
                    background: '#fff',
                    borderRadius: 14,
                    padding: '16px 18px',
                    marginBottom: 10,
                    border: `2px solid ${seed ? (isDanac ? '#bbf7d0' : '#fde68a') : '#f3f4f6'}`,
                    animation: `slideUp 0.3s ease ${Math.min(i * 0.03, 0.5)}s both`,
                    position: 'relative', // crea un stacking context propio
                    zIndex: lotes.length - i, // el primer lote tiene el z-index más alto
                    overflow: 'visible', // asegura que el dropdown no se recorte
                    transition: 'border-color 0.3s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: '#1f2937',
                        }}
                      >
                        {k}
                      </div>
                      {lot.f && (
                        <div
                          style={{
                            fontSize: 12,
                            color: '#9ca3af',
                            marginTop: 1,
                          }}
                        >
                          Finca: {lot.f}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        padding: '4px 14px',
                        borderRadius: 20,
                        background: seed
                          ? isDanac
                            ? '#dcfce7'
                            : '#fef3c7'
                          : '#f3f4f6',
                        fontSize: 13,
                        fontWeight: 700,
                        color: seed
                          ? isDanac
                            ? '#166534'
                            : '#92400e'
                          : '#374151',
                        transition: 'all 0.3s',
                      }}
                    >
                      {lot.h} Ha
                    </div>
                  </div>
                  <SeedSelector
                    value={selections[k] || ''}
                    customValue={customSeeds[k]}
                    onChange={(s: string) =>
                      setSelections((p) => ({ ...p, [k]: s }))
                    }
                    onCustomChange={(v: string) =>
                      setCustomSeeds((p) => ({ ...p, [k]: v }))
                    }
                    zIndex={lotes.length - i}
                  />
                </div>
              );
            })}

            <div
              style={{
                marginTop: 24,
                position: 'sticky',
                bottom: 16,
                zIndex: 0,
              }}
            >
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                style={{
                  width: '100%',
                  padding: 16,
                  borderRadius: 14,
                  border: 'none',
                  background: canSubmit
                    ? 'linear-gradient(135deg,#14532d,#16a34a)'
                    : '#e5e7eb',
                  color: canSubmit ? '#fff' : '#9ca3af',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                  boxShadow: canSubmit
                    ? '0 8px 30px rgba(22,163,74,0.3)'
                    : 'none',
                  transition: 'all 0.3s',
                  animation:
                    canSubmit && !submitting ? 'pulse 2s infinite' : 'none',
                }}
              >
                {submitting
                  ? 'Enviando...'
                  : !stats.allDone
                    ? `Faltan ${stats.total - stats.assigned} lotes`
                    : stats.danacPct < 70
                      ? `DANAC insuficiente (${stats.danacPct.toFixed(1)}%)`
                      : '✓ Enviar Respuesta'}
              </button>
            </div>
          </div>
        )}

        {/* =================== SUBMITTED =================== */}
        {mode === 'submitted' && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              animation: 'fadeIn 0.5s',
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: '#166534',
                marginBottom: 8,
              }}
            >
              ¡Respuesta Registrada!
            </h2>
            <p style={{ fontSize: 16, color: '#374151', marginBottom: 4 }}>
              {producerName}
            </p>
            <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 32 }}>
              {stats.danacPct.toFixed(1)}% DANAC · {totalHa.toFixed(2)} Ha
            </p>
            <div
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: 20,
                border: '1px solid #e5e7eb',
                maxWidth: 420,
                margin: '0 auto',
                textAlign: 'left',
              }}
            >
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#6b7280',
                  marginBottom: 10,
                }}
              >
                Resumen de selección
              </h3>
              {lotes.map((lot: Lote) => {
                const k = String(lot.l);
                const seed = selections[k];
                const isDanac = DANAC_SEEDS.includes(seed);
                return (
                  <div
                    key={k}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '5px 0',
                      borderBottom: '1px solid #f3f4f6',
                      fontSize: 13,
                    }}
                  >
                    <span style={{ fontWeight: 500, color: '#374151' }}>
                      {k} <span style={{ color: '#9ca3af' }}>({lot.h} Ha)</span>
                    </span>
                    <span
                      style={{
                        padding: '2px 10px',
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 600,
                        background: isDanac ? '#dcfce7' : '#fef3c7',
                        color: isDanac ? '#166534' : '#92400e',
                      }}
                    >
                      {customSeeds[k] || seed}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================== ADMIN =================== */}
        {mode === 'admin' && (
          <div style={{ animation: 'fadeIn 0.4s' }}>
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#1f2937',
                  marginBottom: 4,
                }}
              >
                🔗 Enlaces por Productor
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: '#6b7280',
                  marginBottom: 16,
                  lineHeight: 1.5,
                }}
              >
                Cada productor tiene un enlace único y privado. Solo puede ver
                sus propios lotes. Copie y envíe por WhatsApp el enlace
                correspondiente.
              </p>
              <input
                type="text"
                placeholder="Buscar productor..."
                value={adminSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAdminSearch(e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  marginBottom: 14,
                  outline: 'none',
                }}
                onFocus={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor = '#16a34a')
                }
                onBlur={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor = '#e5e7eb')
                }
              />
              <div style={{ maxHeight: 420, overflowY: 'auto' }}>
                {Object.keys(PRODUCERS_DATA)
                  .sort()
                  .filter((n: string) =>
                    n.toLowerCase().includes(adminSearch.toLowerCase())
                  )
                  .map((name: string, i: number) => {
                    const token = PRODUCER_TOKENS[name];
                    const ha = PRODUCERS_DATA[name].reduce(
                      (s, l) => s + l.h,
                      0
                    );
                    const responded = allResponses.some(
                      (r) => r.producer === name
                    );
                    const base =
                      window.location.origin + window.location.pathname;
                    const link = `${base}#${token}`;
                    return (
                      <div
                        key={name}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 12,
                          marginBottom: 6,
                          border: `1px solid ${responded ? '#bbf7d0' : '#f3f4f6'}`,
                          background: responded ? '#f0fdf4' : '#fff',
                          animation: `slideUp 0.2s ease ${i * 0.015}s both`,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 6,
                          }}
                        >
                          <div>
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 14,
                                color: '#1f2937',
                              }}
                            >
                              {responded && (
                                <span
                                  style={{ color: '#16a34a', marginRight: 4 }}
                                >
                                  ✓
                                </span>
                              )}
                              {name}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                color: '#9ca3af',
                                marginLeft: 10,
                              }}
                            >
                              {PRODUCERS_DATA[name].length} lotes ·{' '}
                              {ha.toFixed(1)} Ha
                            </span>
                          </div>
                          <button
                            onClick={() => copyLink(token)}
                            style={{
                              padding: '5px 14px',
                              borderRadius: 8,
                              border: `1px solid ${copied === token ? '#16a34a' : '#d1d5db'}`,
                              background:
                                copied === token ? '#16a34a' : '#f9fafb',
                              cursor: 'pointer',
                              fontSize: 12,
                              fontWeight: 600,
                              fontFamily: 'inherit',
                              color: copied === token ? '#fff' : '#374151',
                              transition: 'all 0.2s',
                              minWidth: 110,
                            }}
                          >
                            {copied === token
                              ? '✓ Copiado!'
                              : '📋 Copiar enlace'}
                          </button>
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: '#9ca3af',
                            background: '#f9fafb',
                            padding: '6px 10px',
                            borderRadius: 6,
                            fontFamily: 'monospace',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {link}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1f2937' }}>
                Respuestas ({allResponses.length}/
                {Object.keys(PRODUCERS_DATA).length})
              </h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={loadAll}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                  }}
                >
                  🔄 Actualizar
                </button>
                {allResponses.length > 0 && (
                  <button
                    onClick={exportCSV}
                    style={{
                      padding: '7px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#166534',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: 'inherit',
                    }}
                  >
                    📥 CSV
                  </button>
                )}
              </div>
            </div>
            {allResponses.length === 0 ? (
              <div
                style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}
              >
                <div style={{ fontSize: 40, marginBottom: 8 }}>📋</div>
                <p>Aún no hay respuestas</p>
              </div>
            ) : (
              allResponses.map((r: StoredResponse, i: number) => {
                const d = r.data;
                return (
                  <div
                    key={i}
                    style={{
                      background: '#fff',
                      borderRadius: 14,
                      padding: 18,
                      marginBottom: 10,
                      border: '1px solid #e5e7eb',
                      animation: `slideUp 0.3s ease ${i * 0.04}s both`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: '#1f2937',
                          }}
                        >
                          {r.producer}
                        </h3>
                        <p
                          style={{
                            fontSize: 11,
                            color: '#9ca3af',
                            marginTop: 2,
                          }}
                        >
                          {d.timestamp
                            ? new Date(d.timestamp).toLocaleString('es-VE')
                            : ''}
                        </p>
                      </div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color:
                            (d.danacPct || 0) >= 70 ? '#16a34a' : '#dc2626',
                        }}
                      >
                        {(d.danacPct || 0).toFixed(1)}%
                      </div>
                    </div>
                    <details style={{ marginTop: 10 }}>
                      <summary
                        style={{
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#6b7280',
                        }}
                      >
                        Ver {(d.lotes || []).length} lotes ·{' '}
                        {(d.totalHa || 0).toFixed(2)} Ha
                      </summary>
                      <div style={{ marginTop: 8, fontSize: 12 }}>
                        {(d.lotes || []).map((lot: LoteResponse, j: number) => (
                          <div
                            key={j}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '5px 0',
                              borderBottom: '1px solid #f3f4f6',
                            }}
                          >
                            <span>
                              {lot.lote}{' '}
                              <span style={{ color: '#9ca3af' }}>
                                ({lot.ha} Ha)
                              </span>
                            </span>
                            <span
                              style={{
                                padding: '1px 8px',
                                borderRadius: 8,
                                fontSize: 11,
                                fontWeight: 600,
                                background:
                                  lot.tipo === 'DANAC' ? '#dcfce7' : '#fef3c7',
                                color:
                                  lot.tipo === 'DANAC' ? '#166534' : '#92400e',
                              }}
                            >
                              {lot.customSeed || lot.semilla}
                            </span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
