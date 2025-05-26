import { Component } from '@angular/core';
import { Motorista } from '../motorista';
import { MotoristaService } from '../motorista.service';
import { TurnoService } from '../turno.service';
import { Turno } from '../turno';

@Component({
  selector: 'app-manager-actions-motorists',
  standalone: false,
  templateUrl: './manager-actions-motorists.component.html',
  styleUrls: ['./manager-actions-motorists.component.css']
})
export class ManagerActionsMotoristsComponent {
  motoristas: Motorista[] = []; // Lista de táxis
  turnos: Turno[] = [];
  motoristasEmUso: Set<string> = new Set();
  
    constructor(private motoristaService: MotoristaService,private turnoService: TurnoService) {}
  
    ngOnInit(): void {
      this.motoristaService.getMotoristas().subscribe({
        next: (data) => {
          this.motoristas = data;
        },
        error: (err) => {
          console.error('Erro ao buscar motoristas:', err);
          alert('Erro ao carregar motoristas.');
        }
      });

       this.turnoService.getTurnos().subscribe({
      next: (turnos) => {
        this.turnos = turnos;
        this.motoristasEmUso = new Set(
          turnos
            .filter((turno) => turno.motorista && turno.motorista._id)
            .map((turno) => turno.motorista._id)
        );
      },
      error: (err) => {
        console.error('Erro ao carregar turnos:', err);
      },
    });
    }

     removerMotorista(motorista: Motorista) {
          if (confirm('Tem certeza que deseja remover este motorista?')) {
            this.motoristaService.deleteMotorista(motorista._id).subscribe({
              next: () => {
                // Após deletar o pedido, recarregar a lista de pedidos
                this.motoristaService.getMotoristas().subscribe({
                  next: (data) => {
                    this.motoristas = data; // Atualiza a lista de pedidos
                    console.log('Pedido cancelado com sucesso!');
                  },
                  error: (err) => {
                    console.error('Erro ao carregar pedidos atualizados:', err);
                  },
                });
              },
              error: (err) => {
                console.error('Erro ao cancelar pedido:', err);
              },
            });
          }
        }
}
