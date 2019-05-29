import { Component, OnInit , Input} from '@angular/core';

import { FunctionService } from '../services/function.service'
import { BackendService } from '../services/backend.service'
import { EventsService } from '../services/events.service'
import { ConfirmationDialogService } from '../modal/alert-confirm/alert-confirm.service';
import { ParametersService } from '../edit/parameters/parameters.service';

@Component({
  selector: 'app-agent-parameters',
  templateUrl: './agent-parameters.component.html',
  styleUrls: ['./agent-parameters.component.scss']
})
export class AgentParametersComponent implements OnInit {

  parametersSelected = []
  opSelected
  apiSelectedOperations
  serviceSelected

  constructor( public backendService: BackendService ,
    public functionService: FunctionService , public confirmationDialogService: ConfirmationDialogService,
    public eventsService: EventsService , public parametersService: ParametersService ) { }

  ngOnInit() {
  }


   /**
   * Sélection d'un agent 
   */
  @Input()
  set operationSelect(name) {
    if(name != -1 && name != 1) {
      this.parametersSelected = name;
    }
  }

  @Input()
  set apiSelect(name) {
    if(name != -1 && name != 1) {
      this.apiSelectedOperations = name;
    }
  }

  /**
   * Sélection d'un agent 
  */
  @Input()
  set serviceSelect(name) {
    if(name != -1 && name != 1) {
      this.serviceSelected = name;
    }
  }
  
  @Input()
  set opSelect(name) {
    if(name != -1 && name != 1) {
      this.opSelected = name;
    }
  }

  editParameters(param){

    this.parametersService.confirm(this.serviceSelected, this.apiSelectedOperations, this.opSelected, "edit", param)
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });

  }

  addParameters(){
    
    this.parametersService.confirm(this.serviceSelected, this.apiSelectedOperations, this.opSelected, "new", "")
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });

  }

  deleteParameters(param){

    this.confirmationDialogService.confirm('', `Etes-vous sur de vouloir supprimer ce PARAM [${param.name}] ?`)
    .then((confirmed) => {
      if(confirmed){

        for(var id in this.opSelected.parameters){
          if(this.opSelected.parameters[id].name == param.name ){
            this.opSelected.parameters.splice(id, 1);
            break;
          }
        }

        let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
        let url = `${agentUrl}${this.serviceSelected.basepath}/${this.apiSelectedOperations.name}/${this.opSelected.method}`

        this.backendService.postData( url , this.opSelected )
        .then(resultatRequest => {
          if( resultatRequest.status == 500) {
            this.backendService.errorsmsg( resultatRequest.error )
          }else {
            this.backendService.successmsg( `API [${this.apiSelectedOperations.name}] - PARAM [${param.name}] supprimé ` )
            this.serviceSelected = resultatRequest
            this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
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




}
