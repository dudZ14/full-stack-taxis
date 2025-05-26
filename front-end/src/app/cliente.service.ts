import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from './cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  private apiUrl = 'http://localhost:3064';
  
  constructor(private http: HttpClient) {}
  
    getClientes(): Observable<Cliente[]> {
      return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
    }

    addCliente(cliente: Cliente): Observable<Cliente> {
      return this.http.post<Cliente>(`${this.apiUrl}/cliente`, cliente);
    }
    
}
