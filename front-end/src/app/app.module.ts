import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MatSelectModule } from '@angular/material/select';  // Importe o MatSelectModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importando o BrowserAnimationsModule
import { ToastrModule } from 'ngx-toastr'; // Importando o ToastrModule

import { AppComponent } from './app.component';
import { ManagerActionsComponent } from './manager-actions/manager-actions.component';
import { MotoristActionsComponent } from './motorist-actions/motorist-actions.component';
import { ClientActionsComponent } from './client-actions/client-actions.component';
import { LayoutComponent } from './layout/layout.component';
import { ManagerActionsTaxiComponent } from './manager-actions-taxi/manager-actions-taxi.component';
import { ManagerActionsMotoristsComponent } from './manager-actions-motorists/manager-actions-motorists.component';
import { ManagerActionsSettingsComponent } from './manager-actions-settings/manager-actions-settings.component';
import { ManagerActionsReportsComponent } from './manager-actions-reports/manager-actions-reports.component';
import { TaxiFormComponent } from './taxi-form/taxi-form.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { MotoristFormComponent } from './motorist-form/motorist-form.component';
import { ViagemFicticiaComponent } from './viagem-ficticia/viagem-ficticia.component';
import { MotoristOptionsComponent } from './motorist-options/motorist-options.component';
import { RequisitarTaxiComponent } from './requisitar-taxi/requisitar-taxi.component';
import { AceitarTaxiComponent } from './aceitar-taxi/aceitar-taxi.component';
import { RegistrarViagemComponent } from './registrar-viagem/registrar-viagem.component';
import { TurnosListComponent } from './turnos-list/turnos-list.component';
import { ListClientComponent } from './list-client/list-client.component';
import { ViagemListComponent } from './viagem-list/viagem-list.component';
import { EditTaxiComponent } from './edit-taxi/edit-taxi.component';
import { EditMotoristaComponent } from './edit-motorista/edit-motorista.component';
import { MotoristaDetailsComponent } from './motorista-details/motorista-details.component';
import { TaxiDetailsComponent } from './taxi-details/taxi-details.component';
import { ViagemDetailComponent } from './viagem-detail/viagem-detail.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MatSelectModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
    }),
    HttpClientModule,
    
  ],
  declarations: [
    AppComponent,
    ManagerActionsComponent,
    MotoristActionsComponent,
    ClientActionsComponent,
    LayoutComponent,
    ManagerActionsTaxiComponent,
    ManagerActionsMotoristsComponent,
    ManagerActionsSettingsComponent,
    ManagerActionsReportsComponent,
    TaxiFormComponent,
    BackButtonComponent,
    MotoristFormComponent,
    ViagemFicticiaComponent,
    MotoristOptionsComponent,
    RequisitarTaxiComponent,
    AceitarTaxiComponent,
    RegistrarViagemComponent,
    TurnosListComponent,
    ListClientComponent,
    ViagemListComponent,
    EditTaxiComponent,
    EditMotoristaComponent,
    MotoristaDetailsComponent,
    TaxiDetailsComponent,
    ViagemDetailComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }