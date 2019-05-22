import { Component, OnInit , Input , Output , EventEmitter } from '@angular/core';

import { FunctionService } from '../services/function.service'
import { BackendService } from '../services/backend.service'
import { ConfirmationDialogService } from '../modal/alert-confirm/alert-confirm.service';
import { OperationsService } from '../edit/operations/operations.service';
import { EventsService } from '../services/events.service'

@Component({
  selector: 'app-agent-operations',
  templateUrl: './agent-operations.component.html',
  styleUrls: ['./agent-operations.component.scss']
})
export class AgentOperationsComponent implements OnInit {

  apiSelectedOperations
  operationSelected
  serviceSelected

  @Output() opSelecte = new EventEmitter();

  constructor( public operationsService: OperationsService , public backendService: BackendService ,
    public functionService: FunctionService , public confirmationDialogService: ConfirmationDialogService ,
    public eventsService: EventsService) { }

  ngOnInit() {
  }


  @Input()
  set apiSelect(name) {
    if(name != -1 && name != 1) {
      this.apiSelectedOperations = name;
      this.operationSelected = this.apiSelectedOperations.operations[0]
      this.opSelecte.emit(this.operationSelected);
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

  onSelectOperation(operation){
    this.operationSelected = operation
    this.opSelecte.emit(this.operationSelected);
  }


  addOperation(){

    this.operationsService.confirm(this.serviceSelected, this.apiSelectedOperations, "", "new")
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });

  }



  deleteOperation(op){
    console.log( op )

    this.confirmationDialogService.confirm('', `Etes-vous sur de vouloir supprimer l'opération [${op.method}] ?`)
    .then((confirmed) => {
      if(confirmed){

        let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + "/"
        let url = `${agentUrl}delete/${this.serviceSelected.basepath}/${this.apiSelectedOperations.name}/${op.method}`
        this.backendService.getData( url )
        .then(resultatRequest => {
          if( resultatRequest.status == 500) {
            this.backendService.errorsmsg( resultatRequest.error )
          }else {
            this.backendService.successmsg( `API [${this.apiSelectedOperations.name}] Opération [${op.method}] supprimée ` )
            this.serviceSelected = resultatRequest
            this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
            this.eventsService.setServiceSelect( this.serviceSelected )
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


  updateOperation(op){

    this.operationsService.confirm(this.serviceSelected, this.apiSelectedOperations, op, "edit")
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });

  }

}
