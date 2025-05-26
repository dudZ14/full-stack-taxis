import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Turno } from '../turno';
import { TurnoService } from '../turno.service';
import { Periodo } from '../periodo'; // Adicionar o tipo Periodo
import { Taxi } from '../taxi';
import { Motorista } from '../motorista';
import { ActivatedRoute, Router } from '@angular/router';
import { MotoristaService } from '../motorista.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-requisitar-taxi',
  standalone: false,
  templateUrl: './requisitar-taxi.component.html',
  styleUrls: ['./requisitar-taxi.component.css']
})
export class RequisitarTaxiComponent implements OnInit{
  inicio: string = '';
  fim: string = '';
  selectedTaxi: Taxi | null = null; 
  motorista: Motorista | null| undefined  = null; 
  turnos: Turno[] | null = null;
  turnosMotorista: Turno[] | null = null;
  taxisDisponiveis: Taxi[] = [];

  constructor(
    private route: ActivatedRoute, private turnoService: TurnoService,private motoristaService: MotoristaService,
     private toastr: ToastrService, private router: Router
  ) {}

  onPeriodoChange() {
    if (this.formularioValido) {
      this.buscarTaxisDisponiveis();
    }
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.motoristaService.getMotoristaById(id).subscribe({
          next: (data) => this.motorista = data,
          error: (err) => console.error('Erro ao buscar motorista:', err)
        });
        this.turnoService.getTurnos().subscribe({
          next: (turnosArray) => {
            if (turnosArray.length > 0) {
              this.turnos = turnosArray;
            } 
          },
          error: (err) => {
            console.error('Erro ao obter turnos:', err);
          }
        });
    
        this.turnoService.getTurnosPorMotorista(id).subscribe({
          next: (turnosArray) => {
            if (turnosArray.length > 0) {
              this.turnosMotorista = turnosArray;
            } 
          },
          error: (err) => {
            console.error('Erro ao obter turnos:', err);
          }
        });
      }
    });

  }

  get erroInicioAntesAgora(): boolean {
    const inicioDate = new Date(this.inicio);
    return this.inicio !== '' && inicioDate <= new Date();
  }
  
  get erroFimAntesInicio(): boolean {
    const inicioDate = new Date(this.inicio);
    const fimDate = new Date(this.fim);
    return this.inicio !== '' && this.fim !== '' && fimDate <= inicioDate;
  }
  
  get erroDuracaoSuperiorOitoHoras(): boolean {
    const inicioDate = new Date(this.inicio);
    const fimDate = new Date(this.fim);
    return this.inicio !== '' && this.fim !== '' && (fimDate.getTime() - inicioDate.getTime()) > 8 * 60 * 60 * 1000;
  }
  
  get erroInterseccaoTurnos(): boolean {
    if (!this.turnosMotorista || !this.inicio || !this.fim) return false;
    const inicioNovo = new Date(this.inicio);
    const fimNovo = new Date(this.fim);
  
    return this.turnosMotorista.some(turno => {
      const inicioExistente = new Date(turno.periodo.inicio);
      const fimExistente = new Date(turno.periodo.fim);
      return inicioNovo < fimExistente && fimNovo > inicioExistente;
    });
  }
  
  // Formulário só é válido se todos os erros estiverem ausentes
  get formularioValido(): boolean {
    return (
      !this.erroInicioAntesAgora &&
      !this.erroFimAntesInicio &&
      !this.erroDuracaoSuperiorOitoHoras &&
      !this.erroInterseccaoTurnos
    );
  }
  

  // Função para obter os táxis disponíveis para o turno
  buscarTaxisDisponiveis(): void {
    if (this.inicio && this.fim) {
      const inicioDate = new Date(this.inicio);
      const fimDate = new Date(this.fim);
      const periodo: Periodo = { _id: '', inicio: inicioDate, fim: fimDate }; // Criar o objeto Periodo
      this.turnoService.getTaxisDisponiveis(periodo).subscribe({
        next: (taxisArray) => {
          this.taxisDisponiveis = taxisArray;
        },
        error: (err) => {
          console.error('Erro ao obter táxis disponíveis:', err);
        }
      });
    }
  }

  // Função para adicionar turno
  addTurno(): void {
    // Verificar se o táxi foi selecionado e as datas de início e fim são válidas
    if (this.selectedTaxi && this.motorista && this.inicio && this.fim) {
      const novoTurno: Turno = {
        _id:'',
        taxi: this.selectedTaxi,  // Agora o taxi é um objeto do tipo Taxi
        motorista:this.motorista,
        periodo: {
          _id:"",
          inicio: new Date(this.inicio),
          fim: new Date(this.fim)
        }
      };

      this.turnoService.addTurno(novoTurno).subscribe({
        next: (turnoAdicionado) => {
          this.toastr.success('Taxi requisitado com sucesso!');
          setTimeout(() => {
            this.router.navigate(['layout/motorist-actions/',this.motorista?._id,'list']);
            }, 1000);
        },
        error: (err) => {
          console.error('Erro ao requisitar taxi:', err);
        }
      });
    } 
  }

  selecionarTaxi(taxi: Taxi): void {
    this.selectedTaxi = taxi;
    console.log('Táxi selecionado:', this.selectedTaxi);
  }
}
