import { Injectable } from '@angular/core';
import { Settings } from './settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = 'http://localhost:3064'; // URL do backend

  constructor(private http: HttpClient) {}

  // Buscar todos os táxis
  getSettings(): Observable<Settings[]> {
    return this.http.get<Settings[]>(`${this.apiUrl}/settings`);
  }

  // Adicionar um novo táxi
  updateSettings(settings: Settings): Observable<Settings> {
    return this.http.put<Settings>(`${this.apiUrl}/settings`, settings);
  }
  
}
