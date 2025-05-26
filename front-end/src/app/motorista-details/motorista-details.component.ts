import { Component } from '@angular/core';
import { Morada } from '../morada';
import { Motorista } from '../motorista';
import { ActivatedRoute, Router } from '@angular/router';
import { MotoristaService } from '../motorista.service';
import { CodigoPostalService } from '../codigo-postal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-motorista-details',
  standalone: false,
  templateUrl: './motorista-details.component.html',
  styleUrls: ['./motorista-details.component.css'],
})
export class MotoristaDetailsComponent {
  nome = '';
  nif!: number;
  genero = '';
  anoNascimento!: number;
  cartaConducao!: number;

  rua = '';
  numeroPorta!: number;
  codigoPostal = '';
  localidade = '';

  codigoPostalInvalido = false;
  motoristasExistentes: Motorista[] = [];
  motoristaId: string = '';

  constructor(
    private router: Router,
    private motoristaService: MotoristaService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.motoristaService.getMotoristas().subscribe((motoristas) => {
      this.motoristasExistentes = motoristas;
    });

    this.motoristaId = this.route.snapshot.paramMap.get('id') || '';

    if (this.motoristaId) {
      this.motoristaService.getMotoristaById(this.motoristaId).subscribe({
        next: (motorista) => {
          this.nome = motorista.nome;
          this.nif = motorista.NIF;
          this.genero = motorista.genero;
          this.anoNascimento = motorista.anoDeNascimento;
          this.cartaConducao = motorista.cartaDeConducao;

          this.rua = motorista.morada.rua;
          this.numeroPorta = motorista.morada.numeroDaPorta;
          this.codigoPostal = motorista.morada.codigoPostal;
          this.localidade = motorista.morada.localidade;
        },
        error: (err) => {
          console.error('Erro ao carregar táxi:', err);
          this.toastr.error('Erro ao carregar os dados do táxi.');
          this.router.navigate(['/layout/manager-actions/motoristas']);
        },
      });
    }
  }

  return() {
    this.router.navigate(['layout/manager-actions/reports']);
  }
}
