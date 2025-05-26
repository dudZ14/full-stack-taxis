import { Injectable } from '@angular/core';
import { Motorista } from './motorista';
import { Morada } from './morada';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MotoristaService {
  private apiUrl = 'http://localhost:3064'; // URL do backend

  constructor(private http: HttpClient) {}

  getMotoristas(): Observable<Motorista[]> {
    return this.http.get<Motorista[]>(`${this.apiUrl}/motoristas`);
  }

  getMotoristaById(id: string): Observable<Motorista> {
    return this.http.get<Motorista>(`${this.apiUrl}/motorista/${id}`);
  }

  addMotorista(motorista: Motorista): Observable<Motorista> {
    return this.http.post<Motorista>(`${this.apiUrl}/motorista`, motorista);
  }

  updateMotorista(id: string, motorista: Motorista): Observable<Motorista> {
    return this.http.put<Motorista>(
      `${this.apiUrl}/motorista/${id}`,
      motorista
    );
  }

  deleteMotorista(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/motorista/${id}`);
  }

  addMorada(morada: Morada): Observable<Morada> {
    return this.http.post<Morada>(`${this.apiUrl}/morada`, morada);
  }
}
