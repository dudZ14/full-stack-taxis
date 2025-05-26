import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importar Router
import { TaxiService } from '../taxi.service';
import { Taxi } from '../taxi';
import { ToastrService } from 'ngx-toastr';
import { ViagemService } from '../viagem.service';

@Component({
  selector: 'app-edit-taxi',
  standalone: false,
  templateUrl: './edit-taxi.component.html',
  styleUrls: ['./edit-taxi.component.css'],
})
export class EditTaxiComponent implements OnInit {
  matricula: string = '';
  anoCompra: number | null = null;
  marcaSelecionada: string = '';
  modeloSelecionado: string = '';
  nivelConforto: string = '';

  marcas: string[] = ['Honda', 'Ford', 'Chevrolet', 'Toyota'];
  niveisConforto: string[] = ['luxuoso', 'básico'];
  taxiId: string = '';

  modelosPorMarca: { [key: string]: string[] } = {
    Honda: ['Civic', 'Accord', 'Jazz'],
    Ford: ['Focus', 'Fiesta', 'Mustang'],
    Chevrolet: ['Cruze', 'Camaro', 'Spark'],
    Toyota: ['Corolla', 'Yaris', 'RAV4'],
  };

  viagemComEsseTaxi: boolean = false;

  constructor(
    private router: Router,
    private taxiService: TaxiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private viagemService: ViagemService
  ) {}

  ngOnInit() {
    this.taxiId = this.route.snapshot.paramMap.get('id') || '';

    if (this.taxiId) {
      this.taxiService.getTaxiById(this.taxiId).subscribe({
        next: (taxi) => {
          this.matricula = taxi.matricula;
          this.anoCompra = taxi.anoDeCompra;
          this.marcaSelecionada = taxi.marca;
          this.modeloSelecionado = taxi.modelo;
          this.nivelConforto = taxi.nivelDeConforto;
        },
        error: (err) => {
          console.error('Erro ao carregar táxi:', err);
          this.toastr.error('Erro ao carregar os dados do táxi.');
          this.router.navigate(['/layout/manager-actions/taxis']);
        },
      });
    }

    this.viagemService.getViagens().subscribe({
      next: (viagens) => {
        this.viagemComEsseTaxi = viagens.some((viagem) => {
          const turno = viagem?.pedido?.turno;
          if (
            typeof turno === 'object' &&
            turno?.taxi &&
            typeof turno.taxi === 'object'
          ) {
            return turno.taxi._id === this.taxiId;
          }
          return false;
        });
      },
      error: (err) => {
        console.error('Erro ao verificar viagens:', err);
      },
    });
  }

  get modelosDisponiveis(): string[] {
    return this.modelosPorMarca[this.marcaSelecionada] || [];
  }

  get matriculaValida(): boolean {
    if (!this.matricula) return false;

    const matricula = this.matricula.toUpperCase();

    // AA-01-XX (desde 2020/2021)
    const formatoNovo = /^[A-Z]{2}-\d{2}-[A-Z]{2}$/;
    if (formatoNovo.test(matricula)) {
      return true; // qualquer combinação de letras é válida neste formato
    }

    // Formatos antigos:
    const formatosAntigos = [
      /^\d{2}-[A-Z]{2}-\d{2}$/, // 00-AA-00
      /^\d{2}-\d{2}-[A-Z]{2}$/, // 00-00-AA
      /^[A-Z]{2}-\d{2}-\d{2}$/, // AA-00-00
    ];

    return formatosAntigos.some((regex) => regex.test(matricula));
  }

  currentYear: number = new Date().getFullYear();

  get anoValido(): boolean {
    return (
      this.anoCompra !== null &&
      this.anoCompra <= this.currentYear &&
      this.anoCompra >= 1900
    );
  }

  get confortoValido(): boolean {
    return this.nivelConforto === 'luxuoso' || this.nivelConforto === 'básico';
  }

  get podeSalvar(): boolean {
    return this.matriculaValida && this.anoValido && this.confortoValido;
  }

  updateTaxi() {
    // Crie um objeto taxi com os dados do formulário
    const novoTaxi: Taxi = {
      _id: '', // Deixe vazio ou gere um ID automaticamente
      matricula: this.matricula.toUpperCase(), // Converte a matrícula para maiúsculas
      anoDeCompra: this.anoCompra!,
      marca: this.marcaSelecionada,
      modelo: this.modeloSelecionado,
      nivelDeConforto: this.nivelConforto,
    };

    // Chame o método do serviço para adicionar o táxi
    this.taxiService.updateTaxi(this.taxiId, novoTaxi).subscribe({
      next: () => {
        this.toastr.success('Táxi atualizado com sucesso!');
        // Redirecionamento após salvar
        this.router.navigate(['layout/manager-actions/taxis']);
      },
      error: (err) => {
        console.error('Erro ao salvar táxi:', err);
        this.toastr.error('Erro ao salvar táxi. Verifique os dados.');
      },
    });
  }
}
