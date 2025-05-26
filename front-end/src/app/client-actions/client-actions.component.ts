import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as L from 'leaflet'; //importar mapa
// Corrigir ícone padrão do Leaflet (necessário para Angular)
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import { PedidoService } from '../pedido.service';
import { Router } from '@angular/router';
import { Morada } from '../morada';
import { Cliente } from '../cliente';
import { Pedido } from '../pedido';

const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
const iconUrl = 'assets/leaflet/marker-icon.png';
const shadowUrl = 'assets/leaflet/marker-shadow.png';

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

@Component({
  selector: 'app-client-actions',
  standalone: false,
  templateUrl: './client-actions.component.html',
  styleUrls: ['./client-actions.component.css'],
})
export class ClientActionsComponent implements OnInit {
  // Cliente
  nome = '';
  nif!: number;
  genero = '';

  // Morada Atual
  numeroPorta!: number;
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
  nivelConforto: string = '';
  niveisConforto: string[] = ['luxuoso', 'básico'];
  latInicio?: number;
  lonInicio?: number;
  latFim?: number;
  lonFim?: number;
  
  mapa: any;
  mapaVisivel = false;
  moradaValida: boolean = true;
  moradaDestinoValida: boolean = true;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private pedidoService: PedidoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tentarObterLocalizacaoAtual();
    setTimeout(() => {
      this.mapaVisivel = true;
    }, 0);
    this.inicializarMapaDestino();
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

  get confortoValido(): boolean {
    return this.nivelConforto === 'luxuoso' || this.nivelConforto === 'básico';
  }

  get podeSalvarMotorista(): boolean {
    return this.nifValido && this.generoValido;
  }

  tentarObterLocalizacaoAtual(): void {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latInicio = position.coords.latitude;
        this.lonInicio = position.coords.longitude;
        console.log("lat cli",this.latInicio);
        console.log("lon cli",this.lonInicio);
        this.preencherMoradaAtualViaCoordenadas(this.latInicio, this.lonInicio);
      },
      () => {}
    );
  }

  preencherMoradaAtualViaCoordenadas(lat: number, lon: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

    this.http.get<any>(url).subscribe((data) => {
      const endereco = data.address;
      this.rua = endereco.road || '';
      if (endereco.house_number && !isNaN(parseInt(endereco.house_number))) {
        this.numeroPorta = parseInt(endereco.house_number);
      }
      this.codigoPostal = endereco.postcode || '';
      this.localidade =
        endereco.city || endereco.town || endereco.village || '';
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
          this.latFim = parseFloat(resultado.lat);
          this.lonFim = parseFloat(resultado.lon);
          this.moradaDestinoValida = true;
        } else {
          this.moradaDestinoValida = false;
          this.latFim = undefined;
          this.lonFim = undefined;
        }
      },
      error: () => {
        this.moradaDestinoValida = false;
      },
    });
  }

  inicializarMapaDestino(): void {
    setTimeout(() => {
      if (this.mapa) {
        this.mapa.remove(); // Limpa se já existir
      }

      this.mapa = L.map('mapaDestino').setView([38.7223, -9.1393], 13); // Lisboa como centro

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.mapa);

      const marcador = L.marker([38.7223, -9.1393], { draggable: true }).addTo(
        this.mapa
      );

      marcador.on('dragend', (event) => {
        const latlng = marcador.getLatLng();
        this.latFim = latlng.lat;
        this.lonFim = latlng.lng;
        this.moradaDestinoValida = true;

        this.reverseGeocoding(latlng.lat, latlng.lng);
      });

      this.mapa.on('click', (e: L.LeafletMouseEvent) => {
        marcador.setLatLng(e.latlng);
        this.latFim = e.latlng.lat;
        this.lonFim = e.latlng.lng;
        this.moradaDestinoValida = true;

        this.reverseGeocoding(e.latlng.lat, e.latlng.lng);
      });
    });
  }

  reverseGeocoding(lat: number, lon: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    this.http.get<any>(url).subscribe((data) => {
      const endereco = data.address;
      this.destinoRua = endereco.road || '';
      if (endereco.house_number && !isNaN(parseInt(endereco.house_number))) {
        this.destinoNumeroPorta = parseInt(endereco.house_number);
      }
      this.destinoCodigoPostal = endereco.postcode || '';
      this.destinoLocalidade =
        endereco.city || endereco.town || endereco.village || '';
    });
  }

  salvarPedido() {
  const moradaInicio: Morada = {
    _id: '',
    rua: this.rua,
    numeroDaPorta: this.numeroPorta,
    codigoPostal: this.codigoPostal,
    localidade: this.localidade,
    lat: this.latInicio,
    lon: this.lonInicio,
  };

  this.pedidoService.addMorada(moradaInicio).subscribe({
    next: (moradaCriadaInicio) => {
      const moradaFim: Morada = {
        _id: '',
        rua: this.destinoRua,
        numeroDaPorta: this.destinoNumeroPorta,
        codigoPostal: this.destinoCodigoPostal,
        localidade: this.destinoLocalidade,
        lat: this.latFim,
        lon: this.lonFim,
      };

      this.pedidoService.addMorada(moradaFim).subscribe({
        next: (moradaCriadaFim) => {
          // Verifica se já existe cliente com o NIF
          this.pedidoService.getClienteByNIF(this.nif).subscribe({
            next: (clienteExistente) => {
              // Se cliente existir, cria só o pedido com esse cliente
              const novoPedido: Pedido = {
                _id: '',
                moradaInicio: moradaCriadaInicio,
                moradaFim: moradaCriadaFim,
                cliente: clienteExistente,
                numeroPessoas: this.numeroPessoas,
                aceiteMotorista: false,
                aceiteCliente: false,
                pedidoConcluido: false,
                motoristaQueAceitou: '',
                motoristasRejeitados: [],
                nivelDeConforto: this.nivelConforto,
              };

              this.pedidoService.addPedido(novoPedido).subscribe({
                next: () => {
                  this.toastr.success('Pedido salvo com sucesso!');
                  this.router.navigate(['layout/list-client']);
                },
                error: (err) => {
                  this.toastr.error('Erro ao salvar pedido: ' + (err.error?.message || 'Erro desconhecido'));
                },
              });
            },
            error: () => {
              // Se cliente não existir, criar cliente normalmente
              const cliente: Cliente = {
                _id: '',
                nome: this.nome,
                NIF: this.nif,
                genero: this.genero,
              };

              this.pedidoService.addCliente(cliente).subscribe({
                next: (clienteCriado) => {
                  const novoPedido: Pedido = {
                    _id: '',
                    moradaInicio: moradaCriadaInicio,
                    moradaFim: moradaCriadaFim,
                    cliente: clienteCriado,
                    numeroPessoas: this.numeroPessoas,
                    aceiteMotorista: false,
                    aceiteCliente: false,
                    pedidoConcluido: false,
                    motoristaQueAceitou: '',
                    motoristasRejeitados: [],
                    nivelDeConforto: this.nivelConforto,
                  };

                  this.pedidoService.addPedido(novoPedido).subscribe({
                    next: () => {
                      this.toastr.success('Pedido salvo com sucesso!');
                      this.router.navigate(['layout/list-client']);
                    },
                    error: (err) => {
                      this.toastr.error('Erro ao salvar pedido: ' + (err.error?.message || 'Erro desconhecido'));
                    },
                  });
                },
                error: (err) => {
                  this.toastr.error('Erro ao salvar cliente: ' + (err.error?.message || 'Erro desconhecido'));
                },
              });
            },
          });
        },
        error: (err) => {
          this.toastr.error('Erro ao salvar morada de destino: ' + (err.error?.message || 'Erro desconhecido'));
        },
      });
    },
    error: (err) => {
      this.toastr.error('Erro ao salvar morada de início: ' + (err.error?.message || 'Erro desconhecido'));
    },
  });
}

}
