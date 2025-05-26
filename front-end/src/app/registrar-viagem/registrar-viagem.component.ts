import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../pedido.service';
import { Pedido } from '../pedido';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Morada } from '../morada';
import { Viagem } from '../viagem';
import { ViagemService } from '../viagem.service';

@Component({
  selector: 'app-registrar-viagem',
  standalone: false,
  templateUrl: './registrar-viagem.component.html',
  styleUrls: ['./registrar-viagem.component.css'],
})
export class RegistrarViagemComponent implements OnInit {
  motoristaId: string = '';
  pedidoCorrente?: Pedido;

  // Cliente
  nome = '';
  nif!: number;
  genero = '';

  // Morada Atual
  numeroPorta!: number;
  lon!: number;
  lat!: number;
  rua = '';
  codigoPostal = '';
  localidade = '';

  // Morada Destino

  destinoNumeroPorta!: number;
  destinoRua = '';
  destinoCodigoPostal = '';
  destinoLocalidade = '';

  // Outros
  numeroPessoas!: number;
  latInicio?: number;
  lonInicio?: number;
  latDestino?: number;
  lonDestino?: number;
  distancia!: number;
  moradaValida: boolean = true;
  moradaDestinoValida: boolean = true;
  numeroSequencia: number = 0;
  inicio: string = '';
  fim: string = '';
  viagens: Viagem[] = [];
  erroPeriodoIntersetado: boolean = false;
  erroForaDoTurno: boolean = false;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private pedidoService: PedidoService,
    private viagemService: ViagemService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.motoristaId = this.route.snapshot.paramMap.get('id') ?? '';
    this.viagemService.getViagensByMotorista(this.motoristaId).subscribe({
      next: (viagens) => {
        this.viagens = viagens;
      },
      error: (err) => {
        console.error('Erro ao obter viagens do motorista:', err);
      },
    });

    this.carregarPedidos();
  }

  get nifValido(): boolean {
    return !!this.nif && /^[1-9][0-9]{8}$/.test(this.nif.toString());
  }

  get numeroPessoasValido(): boolean {
    return !!this.numeroPessoas && this.numeroPessoas >= 1;
  }

  get generoValido(): boolean {
    return this.genero === 'Masculino' || this.genero === 'Feminino';
  }

  get podeSalvarMotorista(): boolean {
    return this.nifValido && this.generoValido;
  }

  carregarPedidos(): void {
    this.pedidoService.getPedidos().subscribe((pedidos) => {
      this.pedidoCorrente = pedidos.find(
        (p) =>
          p.aceiteMotorista &&
          p.aceiteCliente &&
          !p.pedidoConcluido &&
          p.motoristaQueAceitou === this.motoristaId
      );

      if (this.pedidoCorrente) {
        this.nome = this.pedidoCorrente.cliente.nome;
        this.nif = this.pedidoCorrente.cliente.NIF;
        this.genero = this.pedidoCorrente.cliente.genero;
        this.numeroPessoas = this.pedidoCorrente.numeroPessoas;

        this.numeroPorta = this.pedidoCorrente.moradaInicio.numeroDaPorta;
        this.codigoPostal = this.pedidoCorrente.moradaInicio.codigoPostal;
        this.rua = this.pedidoCorrente.moradaInicio.rua;
        this.localidade = this.pedidoCorrente.moradaInicio.localidade;
        this.latInicio = this.pedidoCorrente.moradaInicio.lat;
        this.lonInicio = this.pedidoCorrente.moradaInicio.lon;

        this.destinoNumeroPorta = this.pedidoCorrente.moradaFim.numeroDaPorta;
        this.destinoCodigoPostal = this.pedidoCorrente.moradaFim.codigoPostal;
        this.destinoRua = this.pedidoCorrente.moradaFim.rua;
        this.destinoLocalidade = this.pedidoCorrente.moradaFim.localidade;
        this.latDestino = this.pedidoCorrente.moradaFim.lat;
        this.lonDestino = this.pedidoCorrente.moradaFim.lon;

        if (
          this.latDestino !== undefined &&
          this.lonDestino !== undefined &&
          this.latInicio !== undefined &&
          this.lonInicio !== undefined
        ) {
          this.distancia = this.haversineDistance(
            this.latInicio,
            this.lonInicio,
            this.latDestino,
            this.lonDestino
          );
        }

        if (this.pedidoCorrente.turno) {
          const turnoId =
            typeof this.pedidoCorrente.turno === 'string'
              ? this.pedidoCorrente.turno
              : this.pedidoCorrente.turno?._id;

          this.viagemService
            .obterTotalViagensDoTurno(turnoId)
            .subscribe((total) => {
              this.numeroSequencia = total + 1;
            });
        }
      }
    });
  }

  pedidoElegivelParaConclusao(): boolean {
    return !!this.pedidoCorrente;
  }

  concluirPedido(): void {
    if (!this.pedidoCorrente) {
      alert('Nenhum pedido elegível para conclusão.');
      return;
    }

    const moradaInicio: Morada = {
      _id: '',
      rua: this.rua,
      numeroDaPorta: this.numeroPorta,
      codigoPostal: this.codigoPostal,
      localidade: this.localidade,
    };

    const moradaFim: Morada = {
      _id: '',
      rua: this.destinoRua,
      numeroDaPorta: this.destinoNumeroPorta,
      codigoPostal: this.destinoCodigoPostal,
      localidade: this.destinoLocalidade,
    };

    this.pedidoService.addMorada(moradaInicio).subscribe({
      next: (moradaCriadaInicio) => {
        this.pedidoService.addMorada(moradaFim).subscribe({
          next: (moradaCriadaFim) => {
            if (!this.inicio || isNaN(Date.parse(this.inicio))) {
              this.toastr.error('Data de início inválida.');
              return;
            }
            if (!this.fim || isNaN(Date.parse(this.fim))) {
              this.toastr.error('Data de fim inválida.');
              return;
            }
            const viagem: Viagem = {
              pedido: this.pedidoCorrente!,
              periodo: {
                _id: '',
                inicio: new Date(this.inicio),
                fim: new Date(this.fim),
              },
              moradaInicio: moradaCriadaInicio,
              moradaFim: moradaCriadaFim,
              numeroSequencia: this.numeroSequencia,
              numeroPessoas: this.numeroPessoas,
              distancia: this.distancia,
              custo:0,
            };

            this.viagemService.addViagem(viagem).subscribe({
              next: () => {
                this.pedidoService
                  .updatePedidoConcluido(this.pedidoCorrente!._id, true)
                  .subscribe({
                    next: () => {
                      this.toastr.success('Viagem salva com sucesso!');
                      this.carregarPedidos();
                      setTimeout(() => {
                        this.router.navigate([
                          'layout/motorist-actions/',
                          this.motoristaId,
                          'list-viagem',
                        ]);
                      }, 1000);
                    },
                    error: (err) => {
                      console.error(err);
                      alert('Erro ao concluir o pedido após salvar a viagem.');
                    },
                  });
              },
              error: (err) => {
                console.error('Erro ao salvar a viagem:', err);
                this.toastr.error(
                  'Erro ao salvar a viagem: ' +
                    (err.error?.message || err.message || 'Erro desconhecido')
                );
              },
            });
          },
          error: (err) => {
            this.toastr.error(
              'Erro ao salvar morada de destino: ' +
                (err.error?.message || 'Erro desconhecido')
            );
          },
        });
      },
      error: (err) => {
        this.toastr.error(
          'Erro ao salvar morada de início: ' +
            (err.error?.message || 'Erro desconhecido')
        );
      },
    });
  }

  obterCoordenadasPorMorada(): void {
    const moradaCompleta = `${this.rua}, ${this.numeroPorta}, ${this.codigoPostal}, ${this.localidade}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      moradaCompleta
    )}&format=json&limit=1`;

    this.http.get<any[]>(url).subscribe({
      next: (resultados) => {
        if (resultados.length > 0) {
          const resultado = resultados[0];
          this.latInicio = parseFloat(resultado.lat);
          this.lonInicio = parseFloat(resultado.lon);

          if (this.latDestino !== undefined && this.lonDestino !== undefined) {
            this.distancia = this.haversineDistance(
              this.latInicio,
              this.lonInicio,
              this.latDestino,
              this.lonDestino
            );
          }

          this.moradaValida = true;
        } else {
          this.moradaValida = false;
          this.latInicio = undefined;
          this.lonInicio = undefined;
        }
      },
      error: () => {
        this.moradaValida = false;
      },
    });
  }

  obterCoordenadasPorMoradaDestino(): void {
    const moradaCompleta = `${this.destinoRua}, ${this.destinoNumeroPorta}, ${this.destinoCodigoPostal}, ${this.destinoLocalidade}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      moradaCompleta
    )}&format=json&limit=1`;

    this.http.get<any[]>(url).subscribe({
      next: (resultados) => {
        if (resultados.length > 0) {
          const resultado = resultados[0];
          this.latDestino = parseFloat(resultado.lat);
          this.lonDestino = parseFloat(resultado.lon);

          if (this.latInicio !== undefined && this.lonInicio !== undefined) {
            this.distancia = this.haversineDistance(
              this.latInicio,
              this.lonInicio,
              this.latDestino,
              this.lonDestino
            );
          }

          this.moradaDestinoValida = true;
        } else {
          this.moradaDestinoValida = false;
          this.latDestino = undefined;
          this.lonDestino = undefined;
        }
      },
      error: () => {
        this.moradaDestinoValida = false;
      },
    });
  }

  definirDataInicio(): void {
    const agora = new Date();

    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');

    // Exemplo de resultado: "2025-05-09T15:30"
    this.inicio = `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  }

  haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const r = 6372.8;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));

    return r * c;
  }

  definirDataFim(): void {
    if (
      !this.inicio ||
      this.latInicio === undefined ||
      this.lonInicio === undefined ||
      this.latDestino === undefined ||
      this.lonDestino === undefined
    ) {
      this.toastr.error('Início ou coordenadas não definidas.');
      return;
    }

    if (this.distancia !== undefined) {
      const minutosParaAdicionar = this.distancia * 4;
      const inicioDate = new Date(this.inicio);
      const fimDate = new Date(
        inicioDate.getTime() + minutosParaAdicionar * 60000
      );

      const ano = fimDate.getFullYear();
      const mes = String(fimDate.getMonth() + 1).padStart(2, '0');
      const dia = String(fimDate.getDate()).padStart(2, '0');
      const horas = String(fimDate.getHours()).padStart(2, '0');
      const minutos = String(fimDate.getMinutes()).padStart(2, '0');

      this.fim = `${ano}-${mes}-${dia}T${horas}:${minutos}`;
    }
  }

  verificarInterseccaoDePeriodo(): void {
    this.erroPeriodoIntersetado = false;
    this.erroForaDoTurno = false;

    if (!this.inicio || !this.fim || !this.pedidoCorrente) return;

    const inicioNova = new Date(this.inicio).getTime();
    const fimNova = new Date(this.fim).getTime();

    const turno = this.pedidoCorrente.turno;
    if (
      !turno ||
      typeof turno !== 'object' ||
      !('periodo' in turno) ||
      !turno.periodo
    ) {
      console.warn('Turno inválido ou não definido corretamente.');
      return;
    }
    const inicioTurno = new Date(turno.periodo.inicio).getTime();
    const fimTurno = new Date(turno.periodo.fim).getTime();

    if (inicioNova < inicioTurno || fimNova > fimTurno) {
      this.erroForaDoTurno = true;
      return;
    }

    for (const viagem of this.viagens) {
      const inicioExistente = new Date(viagem.periodo.inicio).getTime();
      const fimExistente = new Date(viagem.periodo.fim).getTime();

      // Se há sobreposição entre [inicioNova, fimNova] e [inicioExistente, fimExistente]
      if (inicioNova <= fimExistente && fimNova >= inicioExistente) {
        this.erroPeriodoIntersetado = true;
        break;
      }
    }
  }

  get erroInicioAntesAgora(): boolean {
    if (!this.inicio) return false;

    const inicioDate = new Date(this.inicio);

    const agora = new Date();
    agora.setSeconds(0);
    agora.setMilliseconds(0);

    return inicioDate < agora;
  }

  get erroFimAntesInicio(): boolean {
    const inicioDate = new Date(this.inicio);
    const fimDate = new Date(this.fim);
    return this.inicio !== '' && this.fim !== '' && fimDate < inicioDate;
  }

  // Formulário só é válido se todos os erros estiverem ausentes
  get formularioValido(): boolean {
    return (
      !this.erroInicioAntesAgora &&
      !this.erroFimAntesInicio &&
      !this.erroPeriodoIntersetado &&
      !this.erroForaDoTurno
    );
  }
}
