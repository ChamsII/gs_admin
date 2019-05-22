import { Component, OnInit , Input} from '@angular/core';

import { FunctionService } from '../services/function.service'
import { BackendService } from '../services/backend.service'
import { EventsService } from '../services/events.service'
import { ConfirmationDialogService } from '../modal/alert-confirm/alert-confirm.service';
import { TransfertsService } from '../edit/transferts/transferts.service';

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
    public eventsService: EventsService , public transfertsService: TransfertsService ) { }

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



}
