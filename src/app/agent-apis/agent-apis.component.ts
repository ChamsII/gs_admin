import { Component, OnInit , Input , Output , EventEmitter } from '@angular/core';

import { ApisService } from '../edit/apis/apis.service';
import { FunctionService } from '../services/function.service'
import { BackendService } from '../services/backend.service'
import { EventsService } from '../services/events.service'
import { ConfirmationDialogService } from '../modal/alert-confirm/alert-confirm.service';

@Component({
  selector: 'app-agent-apis',
  templateUrl: './agent-apis.component.html',
  styleUrls: ['./agent-apis.component.scss']
})
export class AgentApisComponent implements OnInit {

  serviceSelected
  apiSelected
  @Output() apiSelecte = new EventEmitter();
  @Output() editMode = new EventEmitter();

  constructor(public apisService: ApisService , public backendService: BackendService ,
    public functionService: FunctionService , public confirmationDialogService: ConfirmationDialogService,
    public eventsService: EventsService ) { }

  ngOnInit() {

    this.eventsService.apiSelected.subscribe(apiChange => {
      this.apiSelected = apiChange
      this.apiSelecte.emit(this.apiSelected);
    })

  }

  /**
   * Sélection d'un agent 
   */
  @Input()
  set serviceSelect(name) {
    if(name != -1 && name != 1) {
      this.serviceSelected = name;
      this.apiSelected = this.serviceSelected.apis[0]
      this.apiSelecte.emit(this.apiSelected);
    }
  }



  onSelectApi(api) {
    this.apiSelected = api
    this.apiSelecte.emit(this.apiSelected); //operations
  }


  editApi(api){

    this.apisService.confirm(this.serviceSelected, api)
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.apiSelected = this.serviceSelected.apis[0]
        this.apiSelecte.emit(this.apiSelected);
      }
    })
    .catch(() => {
    });

  }


  deleteApi(api){

    this.confirmationDialogService.confirm('', `Etes-vous sur de vouloir supprimer l'API ${api.name} ?`)
    .then((confirmed) => {
      if(confirmed){

        let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + "/"
        let url = `${agentUrl}${this.serviceSelected.basepath}/delete/${api.name}`
        this.backendService.getData( url )
        .then(resultatRequest => {
          if( resultatRequest.status == 500) {
            this.backendService.errorsmsg( resultatRequest.error )
          }else {
            this.backendService.successmsg( "API [" + api.name + "] supprimée" )
            this.serviceSelected = resultatRequest
            this.apiSelected = this.serviceSelected.apis[0]
            this.apiSelecte.emit(this.apiSelected);
          }
          
        })
        .catch(error => {
          this.backendService.errorsmsg( error.message )
        })
        
      }
    })
    .catch(() => {
    });

  }


  addApi() {
    let editmode = {
      status: true,
      mode: 'addApi'
    }
    this.editMode.emit( editmode )
  }




}
