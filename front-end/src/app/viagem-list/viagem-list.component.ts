import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MotoristaService } from '../motorista.service';
import { Motorista } from '../motorista';
import { PedidoService } from '../pedido.service';
import { Pedido } from '../pedido';
import { Viagem } from '../viagem';
import { ViagemService } from '../viagem.service';
import { SettingsService } from '../settings.service';
import { Settings } from '../settings';
import { Turno } from '../turno';

@Component({
  selector: 'app-viagem-list',
  standalone: false,
  templateUrl: './viagem-list.component.html',
  styleUrls: ['./viagem-list.component.css'],
})
export class ViagemListComponent {
  motorista: Motorista | null | undefined = null;
  motoristaId: string = '';
  pedidos: Pedido[] = [];
  viagens: Viagem[] = [];
  settings: Settings | null = null;

  constructor(
    private route: ActivatedRoute,
    private motoristaService: MotoristaService,
    private pedidoService: PedidoService,
    private viagemService: ViagemService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.motoristaId = id;

        this.motoristaService.getMotoristaById(id).subscribe({
          next: (data) => (this.motorista = data),
          error: (err) => console.error('Erro ao buscar motorista:', err),
        });

        this.pedidoService.getPedidos().subscribe((pedidos) => {
          this.pedidos = pedidos;
        });

        this.viagemService.getViagensByMotorista(id).subscribe({
          next: (viagens) => {
            this.viagens = viagens;
            this.viagens.forEach((viagem) => this.calcularCusto(viagem));
          },
          error: (err) => {
            console.error('Erro ao obter viagens do motorista:', err);
          },
        });

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
          },
        });
      }
    });
  }

  pedidoElegivelParaConclusao(): boolean {
    return this.pedidos.some(
      (p) =>
        p.aceiteMotorista &&
        p.aceiteCliente &&
        !p.pedidoConcluido &&
        p.motoristaQueAceitou === this.motoristaId
    );
  }

  calcularCusto(viagem: Viagem) {
    if (!this.settings) {
      alert('As definições ainda não foram carregadas.');
      return;
    }

    const inicioDate = new Date(viagem.periodo.inicio);
    const fimDate = new Date(viagem.periodo.fim);
    
    if (inicioDate >= fimDate) {
      alert('A hora de início deve ser antes da hora de fim.');
      return;
    }
    
    let precoMinuto = this.settings.precoPorMinBasico; // valor padrão
    
    if (
      typeof viagem.pedido.turno === 'object' &&
      viagem.pedido.turno !== null &&
      'taxi' in viagem.pedido.turno &&
      (viagem.pedido.turno as Turno).taxi.nivelDeConforto === 'luxuoso'
    ) {
      precoMinuto = this.settings.precoPorMinLuxuoso;
    }
    
    const minutosTotais = Math.floor(
      (fimDate.getTime() - inicioDate.getTime()) / 60000
    );
    let custoTotal = 0;
    
    const atual = new Date(inicioDate);
    for (let i = 0; i < minutosTotais; i++) {
      const hora = atual.getHours();
      const isNoturno = hora >= 21 || hora < 6;
      const multiplicador = isNoturno
      ? 1 + this.settings.acrescimoPercentual / 100
      : 1;
      custoTotal += precoMinuto * multiplicador;
      atual.setMinutes(atual.getMinutes() + 1);
    }
    
    viagem.custo = parseFloat(custoTotal.toFixed(2));
    if (viagem._id) {
      this.viagemService.updateCustoViagem(viagem._id, viagem.custo).subscribe({
        next: () => console.log('Custo atualizado com sucesso.'),
        error: (err) => console.error('Erro ao atualizar o custo:', err),
      });
    } else {
      console.warn('ID da viagem está indefinido. Custo não foi persistido.');
    }
  }
}
