import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Motorista } from '../motorista';
import { Pedido } from '../pedido';
import { Viagem } from '../viagem';
import { ViagemService } from '../viagem.service';
import { Taxi } from '../taxi';

interface SubtotalViagem {
  viagens: number;
  horas: number;
  kms: number;
  periodoInicio?: Date; // Opcional, pois nem sempre precisamos
  periodoFim?: Date; // Opcional, pois nem sempre precisamos
  idViagem?: string;
}

@Component({
  selector: 'app-manager-actions-reports',
  standalone: false,
  templateUrl: './manager-actions-reports.component.html',
  styleUrls: ['./manager-actions-reports.component.css'],
})
export class ManagerActionsReportsComponent {
  motorista: Motorista | null | undefined = null;
  pedidos: Pedido[] = [];
  viagens: Viagem[] = [];

  dataInicio: Date = new Date();
  dataFim: Date = new Date();
  totalViagens: number = 0;
  totalHoras: number = 0;
  totalKms: number = 0;
  mostrarSubtotaisHoras: boolean = false;
  mostrarSubtotaisKms: boolean = false;
  mostrarSubtotaisViagens: boolean = false;

  subtotaisViagensMotoristas: [Motorista, SubtotalViagem][] = [];
  subtotaisViagensTaxis: [Taxi, SubtotalViagem][] = [];
  tipoSubtotaisAtivo: 'horas' | 'viagens' | 'kms' | null = null;

  expandedViagensId: string | null = null;

  toggleDetalhesViagens(id: string): void {
    if (this.expandedViagensId === id) {
      this.expandedViagensId = null;
      this.calcularSubtotais(); // Recalcula tudo
    } else {
      this.expandedViagensId = id;
      this.calcularSubtotaisExpandido(id); // Apenas detalhado
    }
  }

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService
  ) {}

  ngOnInit(): void {
    const agora = new Date();
    this.dataInicio = new Date(agora.setHours(0, 0, 0, 0));
    this.dataFim = new Date();
    this.dataFim.setHours(23, 59, 59, 999);

    this.route.paramMap.subscribe(() => {
      this.viagemService.getViagens().subscribe({
        next: (viagens) => {
          this.viagens = viagens;
          console.log('tamanho viagens', viagens.length);
          this.calcularTotais();
          this.calcularSubtotais();
        },
        error: (err) => {
          console.error('Erro ao obter viagens do motorista:', err);
        },
      });
    });
  }

  onFiltroDataAlterado(): void {
    if (!this.dataInicio || !this.dataFim) {
      const agora = new Date();
      this.dataInicio = new Date(agora.setHours(0, 0, 0, 0));
      this.dataFim = new Date();
      this.dataFim.setHours(23, 59, 59, 999);
    }

    this.calcularTotais();
    if (this.expandedViagensId) {
      this.calcularSubtotaisExpandido(this.expandedViagensId);
    } else {
      this.calcularSubtotais();
    }
  }

  private calcularTotais(): void {
    const dataInicio = new Date(this.dataInicio);
    const dataFim = new Date(this.dataFim);
    const viagensFiltradas = this.viagens.filter((v) => {
      const inicio = new Date(v.periodo.inicio);
      const fim = new Date(v.periodo.fim);

      return inicio >= dataInicio && fim <= dataFim;
    });

    this.totalViagens = viagensFiltradas.length;
    this.totalHoras = viagensFiltradas.reduce((acc, v) => {
      const duracaoMs =
        new Date(v.periodo.fim).getTime() -
        new Date(v.periodo.inicio).getTime();
      return acc + duracaoMs / (1000 * 60 * 60);
    }, 0);
    this.totalKms = viagensFiltradas.reduce((acc, v) => acc + v.distancia, 0);
  }

  toggleMostrarSubtotais(tipo: 'horas' | 'viagens' | 'kms'): void {
    this.tipoSubtotaisAtivo = tipo;

    this.mostrarSubtotaisHoras = tipo === 'horas';
    this.mostrarSubtotaisKms = tipo === 'kms';
    this.mostrarSubtotaisViagens = tipo === 'viagens';

    if (this.expandedViagensId) {
      this.calcularSubtotaisExpandido(this.expandedViagensId);
    } else {
      this.calcularSubtotais();
    }
  }

  private calcularSubtotais(): void {
    this.calcularSubtotaisMotorista();
    this.calcularSubtotaisTaxi();
  }

  private calcularSubtotaisMotorista(): void {
    const dataInicio = new Date(this.dataInicio);
    const dataFim = new Date(this.dataFim);
    this.subtotaisViagensMotoristas = [];

    this.viagens.forEach((v) => {
      const inicio = new Date(v.periodo.inicio);
      const fim = new Date(v.periodo.fim);
      if (inicio < dataInicio || fim > dataFim) return;
      if (!v.pedido.turno || typeof v.pedido.turno === 'string') return;

      const duracao = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60);

      const motorista = v.pedido.turno.motorista;
      let entry = this.subtotaisViagensMotoristas.find(
        ([key]) => key._id === motorista._id
      );
      if (!entry) {
        this.subtotaisViagensMotoristas.push([
          motorista,
          { viagens: 1, horas: duracao, kms: v.distancia },
        ]);
      } else {
        entry[1].viagens += 1;
        entry[1].horas += duracao;
        entry[1].kms += v.distancia;
      }
    });

    if (this.tipoSubtotaisAtivo === 'horas') {
      this.subtotaisViagensMotoristas.sort((a, b) => b[1].horas - a[1].horas);
    } else if (this.tipoSubtotaisAtivo === 'kms') {
      this.subtotaisViagensMotoristas.sort((a, b) => b[1].kms - a[1].kms);
    } else {
      this.subtotaisViagensMotoristas.sort(
        (a, b) => b[1].viagens - a[1].viagens
      );
    }
  }

  private calcularSubtotaisTaxi(): void {
    const dataInicio = new Date(this.dataInicio);
    const dataFim = new Date(this.dataFim);
    this.subtotaisViagensTaxis = [];

    this.viagens.forEach((v) => {
      const inicio = new Date(v.periodo.inicio);
      const fim = new Date(v.periodo.fim);
      if (inicio < dataInicio || fim > dataFim) return;
      if (!v.pedido.turno || typeof v.pedido.turno === 'string') return;

      const duracao = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60);

      const taxi = v.pedido.turno.taxi;
      let entry = this.subtotaisViagensTaxis.find(
        ([key]) => key._id === taxi._id
      );
      if (!entry) {
        this.subtotaisViagensTaxis.push([
          taxi,
          { viagens: 1, horas: duracao, kms: v.distancia },
        ]);
      } else {
        entry[1].viagens += 1;
        entry[1].horas += duracao;
        entry[1].kms += v.distancia;
      }
    });

    if (this.tipoSubtotaisAtivo === 'horas') {
      this.subtotaisViagensTaxis.sort((a, b) => b[1].horas - a[1].horas);
    } else if (this.tipoSubtotaisAtivo === 'kms') {
      this.subtotaisViagensTaxis.sort((a, b) => b[1].kms - a[1].kms);
    } else {
      this.subtotaisViagensTaxis.sort((a, b) => b[1].viagens - a[1].viagens);
    }
  }

  calcularSubtotaisExpandido(id: string): void {
    const dataInicio = new Date(this.dataInicio);
    const dataFim = new Date(this.dataFim);

    // Limpar os objetos de subtotais
    this.subtotaisViagensMotoristas = [];
    this.subtotaisViagensTaxis = [];

    this.viagens.forEach((v) => {
      const inicio = new Date(v.periodo.inicio);
      const fim = new Date(v.periodo.fim);
      if (inicio < dataInicio || fim > dataFim) return;

      if (!v.pedido.turno || typeof v.pedido.turno === 'string') return;

      const duracao = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60);

      const motorista = v.pedido.turno.motorista;
      const taxi = v.pedido.turno.taxi;

      if (motorista._id === id) {
        this.subtotaisViagensMotoristas.push([
          motorista,
          {
            viagens: 1,
            horas: duracao,
            kms: v.distancia,
            periodoInicio: v.periodo.inicio,
            periodoFim: v.periodo.fim,
            idViagem: v._id,
          },
        ]);
      } else if (taxi._id === id) {
        this.subtotaisViagensTaxis.push([
          taxi,
          {
            viagens: 1,
            horas: duracao,
            kms: v.distancia,
            periodoInicio: v.periodo.inicio,
            periodoFim: v.periodo.fim,
            idViagem: v._id,
          },
        ]);
      }
    });
    if (this.tipoSubtotaisAtivo === 'horas') {
      this.subtotaisViagensMotoristas.sort((a, b) => b[1].horas - a[1].horas);
      this.subtotaisViagensTaxis.sort((a, b) => b[1].horas - a[1].horas);
    } else if (this.tipoSubtotaisAtivo === 'kms') {
      this.subtotaisViagensMotoristas.sort((a, b) => b[1].kms - a[1].kms);
      this.subtotaisViagensTaxis.sort((a, b) => b[1].kms - a[1].kms);
    } else {
      this.subtotaisViagensMotoristas.sort(
        (a, b) =>
          new Date(b[1].periodoFim!).getTime() -
          new Date(a[1].periodoFim!).getTime()
      );

      this.subtotaisViagensTaxis.sort(
        (a, b) =>
          new Date(b[1].periodoFim!).getTime() -
          new Date(a[1].periodoFim!).getTime()
      );
    }
  }
}
