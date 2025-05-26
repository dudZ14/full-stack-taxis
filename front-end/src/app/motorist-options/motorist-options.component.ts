import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MotoristaService } from '../motorista.service';
import { Motorista } from '../motorista';

@Component({
  selector: 'app-motorist-options',
  standalone: false,
  templateUrl: './motorist-options.component.html',
  styleUrls: ['./motorist-options.component.css']
})
export class MotoristOptionsComponent {

  motorista!: Motorista;
  motoristaId!: string;

  constructor(
    private route: ActivatedRoute,
    private motoristaService: MotoristaService
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
      }
    });
  }
  
}
