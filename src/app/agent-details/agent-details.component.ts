import { Component, OnInit , Input } from '@angular/core';

import { FunctionService } from '../services/function.service'
import { BackendService } from '../services/backend.service'
import { EventsService } from '../services/events.service'
import { DetailsService } from '../edit/details/details.service';


@Component({
  selector: 'app-agent-details',
  templateUrl: './agent-details.component.html',
  styleUrls: ['./agent-details.component.scss']
})
export class AgentDetailsComponent implements OnInit {

  dataSetsDetail
  dataSetKey
  apiSelectedOperations
  serviceSelected
  opSelected

  constructor( public backendService: BackendService , public functionService: FunctionService , 
    public eventsService: EventsService , public detailsService: DetailsService ) { }

  ngOnInit() {
  }

  /**
   * Sélection d'un dataset 
   */
  @Input()
  set dataSetsSelect(name) {
    this.dataSetsDetail = name;
  }

  @Input()
  set dataSetKeySelect(name) {
    this.dataSetKey = name;
  }

  @Input()
  set apiSelect(name) {
    if(name != -1 && name != 1) {
      this.apiSelectedOperations = name;
    }
  }

  @Input()
  set serviceSelect(name) {
    if(name != -1 && name != 1) {
      this.serviceSelected = name;
    }
  }

  
  editDetail(){
    this.detailsService.confirm(this.serviceSelected, this.apiSelectedOperations, this.dataSetsDetail,  this.dataSetKey)
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
