import { Component, OnInit } from '@angular/core';
import { TaxiService } from '../taxi.service';
import { Taxi } from '../taxi';
import { TurnoService } from '../turno.service';
import { Turno } from '../turno';

@Component({
  selector: 'app-manager-actions-taxi',
  standalone: false,
  templateUrl: './manager-actions-taxi.component.html',
  styleUrls: ['./manager-actions-taxi.component.css'],
})
export class ManagerActionsTaxiComponent implements OnInit {
  taxis: Taxi[] = []; // Lista de táxis
  turnos: Turno[] = [];
  taxisEmUso: Set<string> = new Set();

  constructor(
    private taxiService: TaxiService,
    private turnoService: TurnoService
  ) {}

  ngOnInit(): void {
    this.taxiService.getTaxis().subscribe({
      next: (data) => {
        this.taxis = data;
      },
      error: (err) => {
        console.error('Erro ao buscar táxis:', err);
        alert('Erro ao carregar táxis.');
      },
    });

    this.turnoService.getTurnos().subscribe({
      next: (turnos) => {
        this.turnos = turnos;
        this.taxisEmUso = new Set(
          turnos
            .filter((turno) => turno.taxi && turno.taxi._id)
            .map((turno) => turno.taxi._id)
        );
      },
      error: (err) => {
        console.error('Erro ao carregar turnos:', err);
      },
    });
  }

  removerTaxi(taxi: Taxi) {
    if (confirm('Tem certeza que deseja remover este taxi?')) {
      this.taxiService.deleteTaxi(taxi._id).subscribe({
        next: () => {
          // Após deletar o pedido, recarregar a lista de pedidos
          this.taxiService.getTaxis().subscribe({
            next: (data) => {
              this.taxis = data; // Atualiza a lista de pedidos
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
