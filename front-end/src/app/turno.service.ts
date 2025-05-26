import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Turno } from './turno';
import { Observable } from 'rxjs';
import { Periodo } from './periodo';
import { Taxi } from './taxi';


@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private apiUrl = 'http://localhost:3064'; // URL do backend

  constructor(private http: HttpClient) {}

  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/turnos`);
  }

  addTurno(turno: Turno): Observable<Turno> {
    return this.http.post<Turno>(`${this.apiUrl}/turno`, turno);
  }

  getTaxisDisponiveis(periodo: Periodo): Observable<Taxi[]> {
    return this.http.post<Taxi[]>(`${this.apiUrl}/taxis-disponiveis`, periodo);
  }

  getTurnosPorMotorista(id: string): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/turnos/motorista/${id}`);
  }
}
