// taxi.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Taxi } from './taxi';

@Injectable({
  providedIn: 'root',
})
export class TaxiService {
  private apiUrl = 'http://localhost:3064'; // URL do backend

  constructor(private http: HttpClient) {}

  // Buscar todos os táxis
  getTaxis(): Observable<Taxi[]> {
    return this.http.get<Taxi[]>(`${this.apiUrl}/taxis`);
  }

  // Adicionar um novo táxi
  addTaxi(taxi: Taxi): Observable<Taxi> {
    return this.http.post<Taxi>(`${this.apiUrl}/taxi`, taxi);
  }

  // Editar um táxi existente
  updateTaxi(id: string, taxi: Taxi): Observable<Taxi> {
    return this.http.put<Taxi>(`${this.apiUrl}/taxi/${id}`, taxi);
  }

  // Remover um táxi
  deleteTaxi(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/taxi/${id}`);
  }

  // Obter táxi por ID
  getTaxiById(id: string): Observable<Taxi> {
    return this.http.get<Taxi>(`${this.apiUrl}/taxi/${id}`);
  }
}
