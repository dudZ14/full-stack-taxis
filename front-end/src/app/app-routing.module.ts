import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerActionsComponent } from './manager-actions/manager-actions.component';
import { MotoristActionsComponent } from './motorist-actions/motorist-actions.component';
import { ClientActionsComponent } from './client-actions/client-actions.component';
import { LayoutComponent } from './layout/layout.component';
import { ManagerActionsTaxiComponent } from './manager-actions-taxi/manager-actions-taxi.component';
import { TaxiFormComponent } from './taxi-form/taxi-form.component';
import { ManagerActionsMotoristsComponent } from './manager-actions-motorists/manager-actions-motorists.component';
import { MotoristFormComponent } from './motorist-form/motorist-form.component';
import { ManagerActionsSettingsComponent } from './manager-actions-settings/manager-actions-settings.component';
import { ViagemFicticiaComponent } from './viagem-ficticia/viagem-ficticia.component';
import { MotoristOptionsComponent } from './motorist-options/motorist-options.component';
import { RequisitarTaxiComponent } from './requisitar-taxi/requisitar-taxi.component';
import { RegistrarViagemComponent } from './registrar-viagem/registrar-viagem.component';
import { AceitarTaxiComponent } from './aceitar-taxi/aceitar-taxi.component';
import { TurnosListComponent } from './turnos-list/turnos-list.component';
import { ListClientComponent } from './list-client/list-client.component';
import { ViagemListComponent } from './viagem-list/viagem-list.component';
import { EditTaxiComponent } from './edit-taxi/edit-taxi.component';
import { EditMotoristaComponent } from './edit-motorista/edit-motorista.component';
import { ManagerActionsReportsComponent } from './manager-actions-reports/manager-actions-reports.component';
import { MotoristaDetailsComponent } from './motorista-details/motorista-details.component';
import { TaxiDetailsComponent } from './taxi-details/taxi-details.component';
import { ViagemDetailComponent } from './viagem-detail/viagem-detail.component';

const routes: Routes = [
  { path: "layout", component: LayoutComponent },
  { path: "layout/manager-actions", component: ManagerActionsComponent },
  { path: 'layout/motorist-actions', component: MotoristActionsComponent },
  { path: 'layout/motorist-actions/:id', component: MotoristOptionsComponent },
  { path: 'layout/motorist-actions/:id/list', component: TurnosListComponent },
  { path: 'layout/motorist-actions/:id/list/requisitar-taxi', component: RequisitarTaxiComponent },
  { path: 'layout/motorist-actions/:id/aceitar-taxi', component: AceitarTaxiComponent },
  { path: 'layout/motorist-actions/:id/list-viagem', component: ViagemListComponent },
  { path: 'layout/motorist-actions/:id/list-viagem/registrar-viagem', component: RegistrarViagemComponent },
  { path: 'layout/list-client/client-actions', component: ClientActionsComponent },
  { path: 'layout/list-client', component: ListClientComponent },
  { path: 'layout/manager-actions/taxis', component: ManagerActionsTaxiComponent },
  { path: 'layout/manager-actions/taxis/create', component: TaxiFormComponent },
  { path: 'layout/manager-actions/taxis/:id', component: EditTaxiComponent },
  { path: 'layout/manager-actions/motorists', component: ManagerActionsMotoristsComponent  },
  { path: 'layout/manager-actions/motorists/motorists-form', component: MotoristFormComponent },
  { path: 'layout/manager-actions/motorists/:id', component: EditMotoristaComponent  },
  { path: 'layout/manager-actions/settings', component: ManagerActionsSettingsComponent },
  { path: 'layout/manager-actions/settings/viagem-ficticia', component: ViagemFicticiaComponent },
  { path: 'layout/manager-actions/reports', component: ManagerActionsReportsComponent},
  { path: 'layout/manager-actions/reports/motorista-details/:id', component: MotoristaDetailsComponent},
  { path: 'layout/manager-actions/reports/taxi-details/:id', component: TaxiDetailsComponent},
  { path: 'layout/manager-actions/reports/viagem-detail/:id', component: ViagemDetailComponent},

  // Wildcard route for undefined paths
  { path: '**', redirectTo: 'layout', pathMatch: 'full' } // Redireciona para a rota padrão
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }