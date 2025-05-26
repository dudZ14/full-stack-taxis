import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Importar Router
import { TaxiService } from '../taxi.service';
import { Taxi } from '../taxi';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-taxi-form',
  standalone: false,
  templateUrl: './taxi-form.component.html',
  styleUrls: ['./taxi-form.component.css']
})
export class TaxiFormComponent {
  matricula: string = '';
  anoCompra: number | null = null;
  marcaSelecionada: string = '';
  modeloSelecionado: string = '';
  nivelConforto: string = '';

  marcas: string[] = ['Honda', 'Ford', 'Chevrolet', 'Toyota'];
  niveisConforto: string[] = ['luxuoso', 'básico'];
  
  modelosPorMarca: { [key: string]: string[] } = {
    Honda: ['Civic', 'Accord', 'Jazz'],
    Ford: ['Focus', 'Fiesta', 'Mustang'],
    Chevrolet: ['Cruze', 'Camaro', 'Spark'],
    Toyota: ['Corolla', 'Yaris', 'RAV4']
  };
  

  constructor(
    private router: Router,
    private taxiService: TaxiService,
    private toastr: ToastrService
  ) {}


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
      /^\d{2}-[A-Z]{2}-\d{2}$/,   // 00-AA-00
      /^\d{2}-\d{2}-[A-Z]{2}$/,   // 00-00-AA
      /^[A-Z]{2}-\d{2}-\d{2}$/    // AA-00-00
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

  salvarTaxi() {
    // Crie um objeto taxi com os dados do formulário
    const novoTaxi: Taxi = {
      _id: '',  // Deixe vazio ou gere um ID automaticamente
      matricula: this.matricula.toUpperCase(), // Converte a matrícula para maiúsculas
      anoDeCompra: this.anoCompra!,
      marca: this.marcaSelecionada,
      modelo: this.modeloSelecionado,
      nivelDeConforto: this.nivelConforto
    };

    // Chame o método do serviço para adicionar o táxi
    this.taxiService.addTaxi(novoTaxi).subscribe({
      next: () => {
        this.toastr.success('Táxi salvo com sucesso!');
        // Redirecionamento após salvar
        this.router.navigate(['layout/manager-actions/taxis']);
      },
      error: (err) => {
        console.error('Erro ao salvar táxi:', err);
        this.toastr.error('Erro ao salvar táxi. Verifique os dados.');
      }
    });
  }
}
