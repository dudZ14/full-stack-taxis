  import { Component, EventEmitter, OnInit, Output } from '@angular/core';
  import { Motorista } from '../motorista';
  import { MotoristaService } from '../motorista.service';
  import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

  @Component({
    selector: 'app-motorist-actions',
    standalone: false,
    templateUrl: './motorist-actions.component.html',
    styleUrls: ['./motorist-actions.component.css']
  })

  export class MotoristActionsComponent implements OnInit {
    motoristas: Motorista[] = [];
    selectedMotorista?: Motorista;
    nif!: number;
    errorMessage: string = '';
    loginModo: 'nif' | 'lista' | null = null;


    constructor(private motoristaService: MotoristaService, private router: Router, private toastr: ToastrService) {}

    ngOnInit(): void {
      this.motoristaService.getMotoristas().subscribe({
        next: (data) => this.motoristas = data,
        error: () => this.errorMessage = 'Erro ao carregar motoristas.'
      });
    }

    loginNif(): void {
      const motorista = this.motoristas.find(m => m.NIF.toString() === this.nif.toString());
      if (!motorista) {
        this.toastr.error('Motorista não encontrado.');
        return;
      }
      else{
        this.toastr.success('Login efetuado com sucesso!');
        this.selectedMotorista = motorista;
        // Adiciona um pequeno atraso antes do redirecionamento, de forma a se ver o alerta
        const motoristaId = this.selectedMotorista._id;
      setTimeout(() => {
          this.router.navigate(['layout/motorist-actions/',motoristaId]);
          }, 1000); // 1 segundo de atraso
      }
    }

    get nifValido(): boolean {
      return !!this.nif && /^[1-9][0-9]{8}$/.test(this.nif.toString());
    }
    

    loginPorSelecao(): void {
      if (this.selectedMotorista) {
        this.toastr.success('Login efetuado com sucesso!');
        const motoristaId = this.selectedMotorista._id;
        setTimeout(() => {
          this.router.navigate(['layout/motorist-actions/',motoristaId]);
          }, 1000); // 1 segundo de atraso
      }
    }

    selecionarMotorista(motorista: Motorista): void {
      this.selectedMotorista = motorista;
    }
    
  }