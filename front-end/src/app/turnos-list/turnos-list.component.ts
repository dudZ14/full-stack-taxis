import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TurnoService } from '../turno.service';
import { MotoristaService } from '../motorista.service';
import { Motorista } from '../motorista';
import { Turno } from '../turno';

@Component({
  selector: 'app-turnos-list',
  standalone: false,
  templateUrl: './turnos-list.component.html',
  styleUrls: ['./turnos-list.component.css']
})
export class TurnosListComponent implements OnInit{

  motorista: Motorista | null| undefined  = null; 
  turnos: Turno[] | null = null;
  motoristaId:string = '';


  constructor(
    private route: ActivatedRoute, private turnoService: TurnoService,private motoristaService: MotoristaService
  ) {}
  
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.motoristaId = id;
        this.motoristaService.getMotoristaById(id).subscribe({
          next: (data) => this.motorista = data,
          error: (err) => console.error('Erro ao buscar motorista:', err)
        });
        
        this.turnoService.getTurnosPorMotorista(id).subscribe({
          next: (turnosArray) => {
            if (turnosArray.length > 0) {
              this.turnos = turnosArray;
            } 
          },
          error: (err) => {
            console.error('Erro ao obter turnos:', err);
          }
        });
      }
    });

  }
}
