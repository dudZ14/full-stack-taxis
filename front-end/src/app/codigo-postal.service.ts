import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodigoPostalService {
  private dadosCarregados = false;
  private codigos: any[] = [];
  private pronto = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.carregarCSV();
  }

  private carregarCSV() {
    this.http.get('assets/codigos_postais.csv', { responseType: 'text' })
      .subscribe({
        next: csv => {
          console.log('CSV carregado com sucesso:', csv.slice(0, 200)); // Apenas uma parte
          const linhas = csv.split('\n').filter(l => l.trim() !== '');
          const cabecalho = linhas[0].split(',');
          console.log('Cabeçalho:', cabecalho);
  
          const iNum = cabecalho.indexOf('num_cod_postal');
          const iExt = cabecalho.indexOf('ext_cod_postal');
          const iNome = cabecalho.indexOf('nome_localidade');
  
          if (iNum === -1 || iExt === -1 || iNome === -1) {
            console.error('Colunas não encontradas no CSV!');
          }
  
          this.codigos = linhas.slice(1).map(linha => {
            const colunas = linha.split(',');
            return {
              num: colunas[iNum]?.trim(),
              ext: colunas[iExt]?.trim(),
              nome: colunas[iNome]?.trim()
            };
          });
  
          this.dadosCarregados = true;
          this.pronto.next(true);
        },
        error: err => {
          console.error('Erro ao carregar CSV:', err);
        }
      });
  }
  

  public getLocalidadePorCodigoPostal(codigoPostal: string): Observable<string | null> {
    return new Observable<string | null>(observer => {
      const [num, ext] = codigoPostal.split('-');

      const procurar = () => {
        const match = this.codigos.find(l =>
          l.num === num && l.ext === ext
        );
        observer.next(match?.nome ?? null);
        observer.complete();
      };

      if (this.dadosCarregados) {
        procurar();
      } else {
        this.pronto.subscribe(() => procurar());
      }
    });
  }
}
