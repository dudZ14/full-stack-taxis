import { Component } from '@angular/core';
import { Morada } from '../morada';
import { Motorista } from '../motorista';
import { ActivatedRoute, Router } from '@angular/router';
import { MotoristaService } from '../motorista.service';
import { CodigoPostalService } from '../codigo-postal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-motorista',
  standalone: false,
  templateUrl: './edit-motorista.component.html',
  styleUrls: ['./edit-motorista.component.css'],
})
export class EditMotoristaComponent {
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
    private codigoPostalService: CodigoPostalService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
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

  get currentYear(): number {
    return new Date().getFullYear();
  }

  get idadeValida(): boolean {
    return (
      !!this.anoNascimento &&
      this.anoNascimento >= 1900 &&
      this.anoNascimento <= this.currentYear - 18
    );
  }

  get cartaConducaoValida(): boolean {
    return (
      !!this.cartaConducao &&
      this.cartaConducao > 0 &&
      !this.motoristasExistentes.some(
        (m) => m.cartaDeConducao === this.cartaConducao && m._id !== this.motoristaId
      )
    );
  }

  get nifValido(): boolean {
    return !!this.nif && /^[1-9][0-9]{8}$/.test(this.nif.toString());
  }

  get generoValido(): boolean {
    return this.genero === 'Masculino' || this.genero === 'Feminino';
  }

  onCodigoPostalChange() {
    this.codigoPostalInvalido = false; // reset antes de verificar
    if (this.codigoPostal.includes('-')) {
      this.codigoPostalService
        .getLocalidadePorCodigoPostal(this.codigoPostal)
        .subscribe((localidade) => {
          if (localidade) {
            this.localidade = localidade;
            this.codigoPostalInvalido = false;
          } else {
            this.localidade = '';
            this.codigoPostalInvalido = true;
          }
        });
    } else {
      this.localidade = '';
      this.codigoPostalInvalido = true;
    }
  }

  get podeSalvarMotorista(): boolean {
    return (
      this.nifValido &&
      this.idadeValida &&
      this.generoValido &&
      this.cartaConducaoValida
    );
  }

  updateMotorista() {
    // Crie o objeto Morada a partir dos campos do formulário
    const morada2: Morada = {
      _id: '', // ou gere um ID, se necessário
      rua: this.rua,
      numeroDaPorta: this.numeroPorta,
      codigoPostal: this.codigoPostal,
      localidade: this.localidade,
    };

    this.motoristaService.addMorada(morada2).subscribe((moradaCriada) => {
      // Crie o objeto Motorista com os dados do formulário
      const novoMotorista: Motorista = {
        _id: '', // ou gere um ID, se necessário
        nome: this.nome,
        NIF: this.nif,
        genero: this.genero,
        anoDeNascimento: this.anoNascimento,
        cartaDeConducao: this.cartaConducao,
        morada: moradaCriada,
      };

      // Chame o serviço para adicionar o motorista
      this.motoristaService.updateMotorista(this.motoristaId,novoMotorista).subscribe({
        next: () => {
          this.toastr.success('Motorista salvo com sucesso!');
          // Redireciona após salvar
          this.router.navigate(['layout/manager-actions/motorists']);
        },
        error: (err) => {
          this.toastr.error(
            'Erro ao salvar motorista: ' +
              (err.error?.message || 'Erro desconhecido')
          );
        },
      });
    });
  }
}
