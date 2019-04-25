import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
    AgentTemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    FormsModule,
    AceEditorModule
  ],
  providers: [BackendService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
