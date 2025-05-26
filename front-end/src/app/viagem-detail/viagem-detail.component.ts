import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Viagem } from '../viagem';
import { ViagemService } from '../viagem.service';


@Component({
  selector: 'app-viagem-detail',
  standalone: false,
  templateUrl: './viagem-detail.component.html',
  styleUrls: ['./viagem-detail.component.css']
})
export class ViagemDetailComponent {
  viagem: Viagem | null = null;

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.viagemService.getViagemById(id).subscribe({
          next: (viagens) => {
            this.viagem = viagens;
          },
          error: (err) => {
            console.error('Erro ao obter viagens do motorista:', err);
          },
        });

      }
    });
  }


   return() {
    this.router.navigate(['layout/manager-actions/reports']);
  }
}
