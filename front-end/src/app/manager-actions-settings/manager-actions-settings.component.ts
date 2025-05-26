import { Component } from '@angular/core';
import { Settings } from '../settings';
import { Router } from '@angular/router';
import { SettingsService } from '../settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manager-actions-settings',
  standalone: false,
  templateUrl: './manager-actions-settings.component.html',
  styleUrls: ['./manager-actions-settings.component.css']
})
export class ManagerActionsSettingsComponent {
  precoBasico: number | null = null;
  precoLuxuoso: number | null = null;
  percentagemNoturna: number | null = null;
 
  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private toastr: ToastrService
  ) {}
  
  ngOnInit(): void {
    this.settingsService.getSettings().subscribe({
      next: (settingsArray) => {
        if (settingsArray.length > 0) {
          const settings = settingsArray[0];
          this.precoBasico = settings.precoPorMinBasico;
          this.precoLuxuoso = settings.precoPorMinLuxuoso;
          this.percentagemNoturna = settings.acrescimoPercentual;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar definições:', err);
        this.toastr.error('Erro ao buscar definições.');
      }
    });

  }

  get precoBasicoValido(): boolean {
    return this.precoBasico !== null && this.precoBasico > 0;
  }

  get precoLuxuosoValido(): boolean {
    return this.precoLuxuoso !== null && this.precoLuxuoso > 0;
  }

  get percentagemNoturnaValida(): boolean {
    return this.percentagemNoturna !== null && this.percentagemNoturna > 0;
  }

  get podeSalvar(): boolean {
    return this.precoBasicoValido && this.precoLuxuosoValido && this.percentagemNoturnaValida;
  }

  salvarSettings() {
      // Crie um objeto taxi com os dados do formulário
      const novaSetting: Settings = {
        _id: '',  // Deixe vazio ou gere um ID automaticamente
        precoPorMinBasico: this.precoBasico!, 
        precoPorMinLuxuoso: this.precoLuxuoso!,
        acrescimoPercentual: this.percentagemNoturna!
        
      };

      this.settingsService.updateSettings(novaSetting).subscribe({
        next: () => {
          this.toastr.success('Definições salvas com sucesso!');
          this.router.navigate(['/layout/manager-actions/settings']);
        },
        error: (err) => {
          console.error('Erro ao salvar definições:', err);
          this.toastr.error('Erro ao salvar definições.');
        }
      });
    }

    irParaSimulador() {
      this.router.navigate(['/layout/manager-actions/settings/viagem-ficticia']);
    }
    
}
