import { Component, OnInit , Input } from '@angular/core';

import { FunctionService } from '../services/function.service'
import { BackendService } from '../services/backend.service'
import { EventsService } from '../services/events.service'
import { ConfirmationDialogService } from '../modal/alert-confirm/alert-confirm.service';
import { PropertiesService } from '../edit/properties/properties.service';
import { RulesService } from '../edit/rules/rules.service';

@Component({
  selector: 'app-agent-properties',
  templateUrl: './agent-properties.component.html',
  styleUrls: ['./agent-properties.component.scss']
})
export class AgentPropertiesComponent implements OnInit {

  reglesSelected = []
  opSelected
  responseSelected
  apiSelectedOperations
  serviceSelected

  constructor(public backendService: BackendService ,
    public functionService: FunctionService , public confirmationDialogService: ConfirmationDialogService,
    public eventsService: EventsService , public propertiesService: PropertiesService , 
    public rulesService: RulesService ) { }

  ngOnInit() {
  }


   /**
   * Sélection d'un agent 
   */
  @Input()
  set operationSelect(name) {
    if(name != -1 && name != 1) {
      this.reglesSelected = name;
    }
  }

  @Input()
  set responseSelect(name) {
    if(name != -1 && name != 1) {
      this.responseSelected = name;
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


  editProperties(){

    this.propertiesService.confirm(this.serviceSelected, this.apiSelectedOperations, this.opSelected, "edit", this.responseSelected)
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });

  }



  addRegles(){
    
    this.rulesService.confirm(this.serviceSelected, this.apiSelectedOperations, this.opSelected, "new", "")
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });

  }

  editRegles(regle){

    this.rulesService.confirm(this.serviceSelected, this.apiSelectedOperations, this.opSelected, "edit", regle)
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });

  }

  deleteRegles(rgl){

    this.confirmationDialogService.confirm('', `Etes-vous sur de vouloir supprimer la règle [${rgl.regle}] ?`)
    .then((confirmed) => {
      if(confirmed){

        for(var id in this.opSelected.regExpKeys){
          if(this.opSelected.regExpKeys[id].regle == rgl.regle ){
            this.opSelected.regExpKeys.splice(id, 1);
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
            this.backendService.successmsg( `API [${this.apiSelectedOperations.name}] - RGL [${rgl.regle}] supprimée ` )
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
