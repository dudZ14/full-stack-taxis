import { Component } from '@angular/core';
import { PedidoService } from '../pedido.service';
import { Pedido } from '../pedido';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../settings.service';
import { Settings } from '../settings';
import { Turno } from '../turno';

@Component({
  selector: 'app-aceitar-taxi',
  standalone: false,
  templateUrl: './aceitar-taxi.component.html',
  styleUrls: ['./aceitar-taxi.component.css'],
})
export class AceitarTaxiComponent {
  pedidos: Pedido[] = []; // Lista de táxis
  carregando = true;
  motoristaId: string = '';
  settings: Settings | null = null;
  turnoAtual: Turno | null = null;

  constructor(
    private pedidoService: PedidoService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.motoristaId = this.route.snapshot.paramMap.get('id') ?? '';
    this.tentarObterLocalizacaoAtual();
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

  aceitarPedido(pedido: Pedido) {
    if (pedido.aceiteMotorista) return;

    this.pedidoService
      .updateAceitePedido(
        pedido._id,
        true,
        pedido.aceiteCliente,
        this.motoristaId
      )
      .subscribe({
        next: () => {
          console.log('Pedido aceite pelo motorista:', this.motoristaId);
          pedido.aceiteMotorista = true; // atualiza localmente
        },
        error: (error) => {
          console.error('Erro ao aceitar pedido:', error);
        },
      });

    if (this.turnoAtual) {
      this.pedidoService
        .updatePedidoTurno(pedido._id, this.turnoAtual._id)
        .subscribe({
          next: () => {
            console.log(
              'Turno do pedido atualizado com sucesso:',
              this.motoristaId
            );
          },
          error: (error) => {
            console.error('Erro ao atualizar turno do pedido:', error);
          },
        });
    } else {
      console.error(
        'Turno atual é null, não foi possível atualizar o turno do pedido.'
      );
    }
  }

  algumPedidoEmCurso(): boolean {
    return this.pedidos.some((p) => p.aceiteMotorista && !p.pedidoConcluido);
  }

  tentarObterLocalizacaoAtual(): void {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log("lat mot",lat);
        console.log("lon mot",lon);
        this.getPedidosOrdenados(lat, lon);
      },
      () => {
        const fallbackLat = 38.756734;
        const fallbackLng = -9.155412;
        this.getPedidosOrdenados(fallbackLat, fallbackLng);
      }
    );
  }

  getPedidosOrdenados(latMotorista: number, lngMotorista: number): void {
    this.carregando = true;
    this.pedidoService.getPedidosValidosPorTurno(this.motoristaId,latMotorista,lngMotorista).subscribe({
      next: async (res: { turnoAtual: any; pedidosValidos: Pedido[] }) => {
        this.turnoAtual = res.turnoAtual;
        const pedidosValidos = res.pedidosValidos;

        if (!this.turnoAtual) {
          console.log('Nenhum turno ativo no momento.');
          this.pedidos = [];
          this.carregando = false;
          return;
        }

        const pedidosFiltrados = pedidosValidos.filter((p) => {
          if (p.pedidoConcluido) {
            return false;
          }
          if (p.motoristaQueAceitou !== this.motoristaId && p.aceiteMotorista) {
            return false;
          }
          if (p.motoristasRejeitados?.includes(this.motoristaId)) {
            return false;
          }
          return true;
        });

        this.pedidos = pedidosFiltrados.sort(
          (a, b) => (a.distancia ?? Infinity) - (b.distancia ?? Infinity)
        );

        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao obter turno atual:', err);
        this.pedidos = [];
        this.carregando = false;
      },
    });
  }

  //formula haversine
  getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const r = 6372.8; // novo raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    lat1 = this.deg2rad(lat1);
    lat2 = this.deg2rad(lat2);

    const a =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dLon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));

    return r * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
