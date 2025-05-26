import { Component } from '@angular/core';
import { SettingsService } from '../settings.service';
import { Location } from '@angular/common';
import { Settings } from '../settings';

@Component({
  selector: 'app-viagem-ficticia',
  standalone: false,
  templateUrl: './viagem-ficticia.component.html',
  styleUrls: ['./viagem-ficticia.component.css']
})
export class ViagemFicticiaComponent {
  inicio: string = '';
  fim: string = '';
  tipoConforto: 'básico' | 'luxuoso' = 'básico';
  custo: number | null = null;

  settings: Settings | null = null;

  constructor(
    private settingsService: SettingsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe({
      next: (settingsArray) => {
        if (settingsArray.length > 0) {
          this.settings = settingsArray[0];
        } else {
          alert('Definições não encontradas.');
        }
      },
      error: (err) => {
        console.error('Erro ao obter definições:', err);
        alert('Erro ao carregar definições.');
      }
    });
  }

  get inicioValido(): boolean {
    return !!this.inicio;
  }

  get fimValido(): boolean {
    return !!this.fim && new Date(this.fim) > new Date(this.inicio);
  }

  get tipoConfortoValido(): boolean {
    return this.tipoConforto === 'básico' || this.tipoConforto === 'luxuoso';
  }

  get formularioValido(): boolean {
    return this.inicioValido && this.fimValido && this.tipoConfortoValido;
  }

  calcularCusto() {
    if (!this.settings) {
      alert('As definições ainda não foram carregadas.');
      return;
    }

    const inicioDate = new Date(this.inicio);
    const fimDate = new Date(this.fim);

    if (inicioDate >= fimDate) {
      alert('A hora de início deve ser antes da hora de fim.');
      return;
    }

    const precoMinuto = this.tipoConforto === 'básico'
      ? this.settings.precoPorMinBasico
      : this.settings.precoPorMinLuxuoso;

    const minutosTotais = Math.floor((fimDate.getTime() - inicioDate.getTime()) / 60000);
    let custoTotal = 0;

    const atual = new Date(inicioDate);
    for (let i = 0; i < minutosTotais; i++) {
      const hora = atual.getHours();
      const isNoturno = hora >= 21 || hora < 6;
      const multiplicador = isNoturno ? (1 + this.settings.acrescimoPercentual / 100) : 1;
      custoTotal += precoMinuto * multiplicador;
      atual.setMinutes(atual.getMinutes() + 1);
    }

    this.custo = parseFloat(custoTotal.toFixed(2));
  }

  voltarAtras() {
    this.location.back();
  }
}
