import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
//import {MatStepperModule} from '@angular/material/stepper'; 

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr'; 

import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatInputModule} from '@angular/material/input'
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDialogModule} from '@angular/material/dialog'; 
import {ScrollDispatchModule} from '@angular/cdk/scrolling'; 

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  //MatFormFieldModule,
  //MatInputModule,
  MatOptionModule
} from '@angular/material';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AceEditorModule } from 'ng2-ace-editor';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarsComponent } from './sidebar/sidebar.component';
import { BackendService } from './services/backend.service';
import { AgentDashComponent } from './agent-dash/agent-dash.component';
import { AgentServicesComponent } from './agent-services/agent-services.component';
import { AgentApisComponent } from './agent-apis/agent-apis.component';
import { AgentOperationsComponent } from './agent-operations/agent-operations.component';
import { AgentTransfertsComponent } from './agent-transferts/agent-transferts.component';
import { AgentFeedersComponent } from './agent-feeders/agent-feeders.component';
import { AgentParametersComponent } from './agent-parameters/agent-parameters.component';
import { AgentPropertiesComponent } from './agent-properties/agent-properties.component';
import { AgentDetailsComponent } from './agent-details/agent-details.component';
import { AgentDatasetsComponent } from './agent-datasets/agent-datasets.component';
import { AgentTemplateComponent } from './agent-template/agent-template.component';
import { AgentEditComponent } from './agent-edit/agent-edit.component';
import { AlertConfirmComponent } from './modal/alert-confirm/alert-confirm.component';
import { ConfirmationDialogService } from './modal/alert-confirm/alert-confirm.service';
import { FilterPipe } from './filter.pipe';
import { ApisComponent } from './edit/apis/apis.component';
import { ApisService } from './edit/apis/apis.service';
import { FunctionService } from './services/function.service';
import { EventsService } from './services/events.service';
import { OperationsComponent } from './edit/operations/operations.component';
import { OperationsService } from './edit/operations/operations.service';
import { TransfertsComponent } from './edit/transferts/transferts.component';
import { TransfertsService } from './edit/transferts/transferts.service';
import { FeedersComponent } from './edit/feeders/feeders.component';
import { FeedersService } from './edit/feeders/feeders.service';
import { ParametersComponent } from './edit/parameters/parameters.component';
import { ParametersService } from './edit/parameters/parameters.service';
import { PropertiesComponent } from './edit/properties/properties.component';
import { PropertiesService } from './edit/properties/properties.service';
import { RulesComponent } from './edit/rules/rules.component';
import { RulesService } from './edit/rules/rules.service';
import { DatasetsComponent } from './edit/datasets/datasets.component';
import { DatasetsService } from './edit/datasets/datasets.service';
import { DetailsComponent } from './edit/details/details.component';
import { DetailsService } from './edit/details/details.service';
import { TemplateComponent } from './edit/template/template.component';
import { TemplateService } from './edit/template/template.service';
import { AgentComponent } from './edit/agent/agent.component';
import { AgentService } from './edit/agent/agent.service';
import { GenerationComponent } from './generation/generation.component';
import { AgentsComponent } from './modal/agents/agents.component';
import { AgentsService } from './modal/agents/agents.service';
import { NewfilefeederComponent } from './edit/newfilefeeder/newfilefeeder.component';
import { NewfilefeederService } from './edit/newfilefeeder/newfilefeeder.service';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SidebarsComponent,
    AgentDashComponent,
    AgentServicesComponent,
    AgentApisComponent,
    AgentOperationsComponent,
    AgentTransfertsComponent,
    AgentFeedersComponent,
    AgentParametersComponent,
    AgentPropertiesComponent,
    AgentDetailsComponent,
    AgentDatasetsComponent,
    AgentTemplateComponent,
    AgentEditComponent,
    AlertConfirmComponent,
    FilterPipe,
    ApisComponent,
    OperationsComponent,
    TransfertsComponent,
    FeedersComponent,
    ParametersComponent,
    PropertiesComponent,
    RulesComponent,
    DatasetsComponent,
    DetailsComponent,
    TemplateComponent,
    AgentComponent,
    GenerationComponent,
    AgentsComponent,
    NewfilefeederComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    FormsModule,
    AceEditorModule,
    MatStepperModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatIconModule,
    MatToolbarModule, 
    MatCardModule,
    DragDropModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatOptionModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
    }),
    ScrollDispatchModule

    
  ],
  entryComponents: [
    AlertConfirmComponent,
    ApisComponent,
    OperationsComponent,
    TransfertsComponent,
    FeedersComponent,
    ParametersComponent,
    PropertiesComponent,
    RulesComponent ,
    DatasetsComponent,
    DetailsComponent,
    TemplateComponent,
    AgentComponent,
    AgentsComponent,
    NewfilefeederComponent
  ],
  providers: [
    BackendService , ConfirmationDialogService , ApisService , 
    FunctionService , OperationsService , EventsService , 
    TransfertsService , FeedersService , ParametersService ,
    PropertiesService , RulesService , DatasetsService ,
    DetailsService , TemplateService , AgentService , 
    AgentsService , NewfilefeederService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
