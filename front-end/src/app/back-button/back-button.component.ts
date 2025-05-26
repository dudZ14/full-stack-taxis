import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  standalone: false,
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css']
})
export class BackButtonComponent {
  constructor(private location: Location, public router:Router) {}

  mostrarBotaoVoltar(): boolean {
  const url = this.router.url;
  return !(
    url === '/layout' ||
    url.startsWith('/layout/manager-actions/reports/motorista-details') ||
    url.startsWith('/layout/manager-actions/reports/taxi-details') ||
    url.startsWith('/layout/manager-actions/reports/viagem-detail')
  );
}


  voltar() {
    const urlAtual = this.router.url;

    // Se a URL contiver mais de 1 segmento (por exemplo: /x/y/z), remover a última parte
    const segments = urlAtual.split('/');
    
    if (segments.length > 2) {
      segments.pop(); // Remove a última parte
      const urlAnterior = segments.join('/');
      this.router.navigate([urlAnterior]); // Redireciona para a URL anterior (sem a última parte)
    } 
    // Caso contrário, se já estivermos na raiz da rota (ex: /x/y), vamos voltar para a página anterior
    else {
      this.location.back(); // Usa o histórico para voltar
    }
  }
}
