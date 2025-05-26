import { Component } from '@angular/core';
import { Pedido } from '../pedido';
import { PedidoService } from '../pedido.service';
import { Turno } from '../turno';
import { Taxi } from '../taxi';
import { SettingsService } from '../settings.service';
import { Settings } from '../settings';

@Component({
  selector: 'app-list-client',
  standalone: false,
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.css'],
})
export class ListClientComponent {
  pedidos: Pedido[] = []; // Lista de táxis
  settings: Settings | null = null;

  constructor(
    private pedidoService: PedidoService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.pedidoService.getPedidos().subscribe({
      next: (data) => {
        this.pedidos = data.filter((p) => !p.pedidoConcluido);
        console.log(this.pedidos.length);
      },
      error: (err) => {
        console.error('Erro ao buscar táxis:', err);
        alert('Erro ao carregar táxis.');
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

  aceitarMotorista(): void {
    const pedido = this.pedidos.find(
      (p) => p.aceiteMotorista && !p.aceiteCliente
    );

    if (!pedido) {
      alert('Nenhum pedido aguardando aceite do cliente.');
      return;
    }

    this.pedidoService
      .updateAceitePedido(pedido._id, true, true, pedido.motoristaQueAceitou)
      .subscribe({
        next: () => {
          console.log('Pedido aceite com sucesso:', pedido);

          // Atualiza diretamente o objeto (garantir que view muda)
          pedido.aceiteCliente = true;
        },
        error: (error) => {
          console.error('Erro ao aceitar pedido:', error);
        },
      });
  }

  isTurno(value: any): value is Turno {
    return typeof value === 'object' && value !== null && 'motorista' in value;
  }

  isTaxi(value: any): value is Taxi {
    return typeof value === 'object' && value !== null && 'motorista' in value;
  }

  recusarMotorista(pedido: Pedido): void {
    this.pedidoService
      .rejeitarMotorista(pedido._id, pedido.motoristaQueAceitou)
      .subscribe({
        next: () => {
          // Limpar aceite e motorista localmente
          pedido.aceiteMotorista = false;
          pedido.motoristaQueAceitou = '';

          // Agora remove o turno do pedido
          this.pedidoService.updatePedidoTurno(pedido._id, null).subscribe({
            next: () => {
              pedido.turno = null;
              console.log('Turno removido do pedido após recusa.');
            },
            error: (err) => {
              console.error('Erro ao remover turno do pedido:', err);
            },
          });
        },
        error: (err) => {
          console.error('Erro ao recusar motorista:', err);
        },
      });
  }

  cancelarPedido(pedido: Pedido) {
    if (confirm('Tem certeza que deseja cancelar este pedido?')) {
      this.pedidoService.deletePedido(pedido._id).subscribe({
        next: () => {
          // Após deletar o pedido, recarregar a lista de pedidos
          this.pedidoService.getPedidos().subscribe({
            next: (data) => {
              this.pedidos = data.filter((p) => !p.pedidoConcluido); // Atualiza a lista de pedidos
              console.log('Pedido cancelado com sucesso!');
            },
            error: (err) => {
              console.error('Erro ao carregar pedidos atualizados:', err);
            },
          });
        },
        error: (err) => {
          console.error('Erro ao cancelar pedido:', err);
        },
      });
    }
  }

  calcularCustoEstimado(pedido: Pedido): number {
    if(!pedido.distancia){
      pedido.distancia = 0;
    }
    if (!this.settings || !pedido.distanciaDestino)
      return 0;

    console.log("nome cliente", pedido.cliente.nome);
    const minutosChegada = pedido.distancia * 4;
    const minutosViagem = pedido.distanciaDestino * 4;
    console.log('distancia cliente:', pedido.distancia);
    console.log('distancia destino:', pedido.distanciaDestino);

    const inicio = new Date();
    inicio.setMinutes(inicio.getMinutes() + minutosChegada);

    const fim = new Date(inicio);
    fim.setMinutes(fim.getMinutes() + minutosViagem);

    const minutosTotais = Math.floor((fim.getTime() - inicio.getTime()) / 60000);

    // Verificar se o 'turno' é realmente um objeto 'Turno'
    let precoMinuto = 0;
    if (pedido.turno && typeof pedido.turno !== 'string' && pedido.turno.taxi) {
      precoMinuto =
        pedido.turno.taxi.nivelDeConforto === 'básico'
          ? this.settings.precoPorMinBasico
          : this.settings.precoPorMinLuxuoso;
    } else {
      // Caso não tenha turno válido, usa o valor padrão ou outro valor
      precoMinuto = this.settings.precoPorMinLuxuoso;
    }
    console.log("preco min",precoMinuto);

    let custoTotal = 0;
    const atual = new Date(inicio);
    console.log("min viagem",minutosTotais);
    for (let i = 0; i < minutosTotais; i++) {
      console.log("custo total",custoTotal);
      console.log("i:",i);
      const hora = atual.getHours();
      const isNoturno = hora >= 21 || hora < 6;
      const multiplicador = isNoturno
        ? 1 + this.settings.acrescimoPercentual / 100
        : 1;
      custoTotal += precoMinuto * multiplicador;
      atual.setMinutes(atual.getMinutes() + 1);
    }

    console.log('custo total:', custoTotal);
    return parseFloat(custoTotal.toFixed(2));
  }
}
