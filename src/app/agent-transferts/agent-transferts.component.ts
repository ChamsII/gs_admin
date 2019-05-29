import { Component, OnInit , Input } from '@angular/core';

import { FunctionService } from '../services/function.service'
import { BackendService } from '../services/backend.service'
import { EventsService } from '../services/events.service'
import { ConfirmationDialogService } from '../modal/alert-confirm/alert-confirm.service';
import { TransfertsService } from '../edit/transferts/transferts.service';


@Component({
  selector: 'app-agent-transferts',
  templateUrl: './agent-transferts.component.html',
  styleUrls: ['./agent-transferts.component.scss']
})
export class AgentTransfertsComponent implements OnInit {

  transferProperties = []
  opSelected
  apiSelectedOperations
  serviceSelected

  constructor( public backendService: BackendService ,
    public functionService: FunctionService , public confirmationDialogService: ConfirmationDialogService,
    public eventsService: EventsService , public transfertsService: TransfertsService ) { }

  ngOnInit() {
  }


   /**
   * Sélection d'un agent 
   */
  @Input()
  set operationSelect(name) {
    if(name != -1 && name != 1) {
      this.transferProperties = name;
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


  addTransferPropertie(){
    
    this.transfertsService.confirm(this.serviceSelected, this.apiSelectedOperations, this.opSelected, "new", "")
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });

  }


  editTransfert(tps){

    this.transfertsService.confirm(this.serviceSelected, this.apiSelectedOperations, this.opSelected, "edit", tps)
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });

  }


  deleteTransfert(tps){

    this.confirmationDialogService.confirm('', `Etes-vous sur de vouloir supprimer ce TP [${tps.name}] ?`)
    .then((confirmed) => {
      if(confirmed){

        for(var id in this.opSelected.transferProperties){
          if(this.opSelected.transferProperties[id].name == tps.name ){
            this.opSelected.transferProperties.splice(id, 1);
            break;
          }
        }

        for(var id in this.opSelected.keys){
          if(this.opSelected.keys[id] == tps.name){
            this.opSelected.keys.splice(id, 1);
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
            this.backendService.successmsg( `API [${this.apiSelectedOperations.name}] - TP [${tps.name}] supprimé ` )
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
