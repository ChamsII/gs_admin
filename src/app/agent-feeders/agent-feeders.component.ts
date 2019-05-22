import { Component, OnInit , Input } from '@angular/core';

import { FunctionService } from '../services/function.service'
import { BackendService } from '../services/backend.service'
import { EventsService } from '../services/events.service'
import { ConfirmationDialogService } from '../modal/alert-confirm/alert-confirm.service';
import { FeedersService } from '../edit/feeders/feeders.service';


@Component({
  selector: 'app-agent-feeders',
  templateUrl: './agent-feeders.component.html',
  styleUrls: ['./agent-feeders.component.scss']
})
export class AgentFeedersComponent implements OnInit {

  feedersSelected = []
  opSelected
  apiSelectedOperations
  serviceSelected

  constructor(public backendService: BackendService ,
    public functionService: FunctionService , public confirmationDialogService: ConfirmationDialogService,
    public eventsService: EventsService , public feedersService: FeedersService) { }

  ngOnInit() {
  }


   /**
   * Sélection d'un agent 
   */
  @Input()
  set operationSelect(name) {
    if(name != -1 && name != 1) {
      this.feedersSelected = name;
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

  addFeederProperties(){
    this.feedersService.confirm(this.serviceSelected, this.apiSelectedOperations, this.opSelected, "new", "")
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });
  }

  editFeederPropertiest(fd){
    this.feedersService.confirm(this.serviceSelected, this.apiSelectedOperations, this.opSelected, "edit", fd)
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });
  }

  deleteFeeder(fd){

    this.confirmationDialogService.confirm('', `Etes-vous sur de vouloir supprimer ce FD [${fd.csvFile}] ?`)
    .then((confirmed) => {
      if(confirmed){

        for(var id in this.opSelected.feederProperties){
          if(this.opSelected.feederProperties[id].csvFile == fd.csvFile ){
            this.opSelected.feederProperties.splice(id, 1);
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
            this.backendService.successmsg( `API [${this.apiSelectedOperations.name}] - Feeder [${fd.csvFile}] supprimé ` )
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
