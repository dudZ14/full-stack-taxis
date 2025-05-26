import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importar Router
import { TaxiService } from '../taxi.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-taxi-details',
  standalone: false,
  templateUrl: './taxi-details.component.html',
  styleUrls: ['./taxi-details.component.css']
})
export class TaxiDetailsComponent {
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

    
  }

  get modelosDisponiveis(): string[] {
    return this.modelosPorMarca[this.marcaSelecionada] || [];
  }


  return() {
    this.router.navigate(['layout/manager-actions/reports']);
  }
}
