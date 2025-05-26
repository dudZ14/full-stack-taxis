import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Viagem } from './viagem';
import { Morada } from './morada';
import { Cliente } from './cliente';

@Injectable({
  providedIn: 'root',
})
export class ViagemService {
  private apiUrl = 'http://localhost:3064'; // URL do backend

  constructor(private http: HttpClient) {}

  obterTotalViagensDoTurno(turnoId: string): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/viagens/turno/${turnoId}/total-viagens`
    );
  }

  getViagens(): Observable<Viagem[]> {
    return this.http.get<Viagem[]>(`${this.apiUrl}/viagens`);
  }

  getViagensByMotorista(motoristaId: string): Observable<Viagem[]> {
    return this.http.get<Viagem[]>(
      `${this.apiUrl}/viagens/motorista/${motoristaId}`
    );
  }

  addViagem(viagem: Viagem): Observable<Viagem> {
    return this.http.post<Viagem>(`${this.apiUrl}/viagem`, viagem);
  }

  addCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/cliente`, cliente);
  }

  addMorada(morada: Morada): Observable<Morada> {
    return this.http.post<Morada>(`${this.apiUrl}/pedido/morada`, morada);
  }

  updateCustoViagem(id: string, custo: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/viagens/${id}/custo`, { custo });
  }

  // No ViagemService
getViagemById(viagemId: string): Observable<Viagem> {
  return this.http.get<Viagem>(`${this.apiUrl}/viagens/${viagemId}`);
}

}
