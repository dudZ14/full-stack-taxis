import { Injectable } from '@angular/core';
import { Pedido } from './pedido';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Morada } from './morada';
import { Cliente } from './cliente';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private apiUrl = 'http://localhost:3064'; // URL do backend

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/pedidos`);
  }

  addPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/pedido`, pedido);
  }

  deletePedido(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pedido/${id}`);
  }  

  updateAceitePedido(id: string, aceiteMotorista: boolean, aceiteCliente: boolean, motoristaQueAceitou: string): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/pedido/${id}/aceite`, { aceiteMotorista, aceiteCliente, motoristaQueAceitou });
  }

  updatePedidoConcluido(id: string, pedidoConcluido: boolean): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/pedido/${id}/concluido`, { pedidoConcluido });
  }

  addMorada(morada: Morada): Observable<Morada> {
        return this.http.post<Morada>(`${this.apiUrl}/pedido/morada`, morada);
  }

  addCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/cliente`, cliente);
  }

  getClienteByNIF(nif: number): Observable<Cliente> {
  return this.http.get<Cliente>(`${this.apiUrl}/clientes/nif/${nif}`);
}

  rejeitarMotorista(id: string, motoristaId: string): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/pedido/${id}/rejeitar-motorista`, { motoristaId });
  }
  
  getPedidosValidosPorTurno(motoristaId: string, lat: number, lon: number): Observable<any> {
    const url = `${this.apiUrl}/motorista/${motoristaId}/turno-atual?lat=${lat}&lon=${lon}`;
    return this.http.get<any>(url);
  }  
  

  updatePedidoTurno(pedidoId: string, turnoId: string|null): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedido/${pedidoId}/turno`, { turno: turnoId });
  }

  updatePedidoDistancia(pedidoId: string, distancia: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedido/${pedidoId}/distancia`, { distancia: distancia });
  }

  updatePedidoDistanciaDestino(pedidoId: string, distanciaDestino: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedido/${pedidoId}/distancia-destino`, { distanciaDestino: distanciaDestino });
  }
  
}
