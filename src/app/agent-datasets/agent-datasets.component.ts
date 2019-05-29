import { Component, OnInit , Input , EventEmitter , Output } from '@angular/core';

import { FunctionService } from '../services/function.service'
import { BackendService } from '../services/backend.service'
import { EventsService } from '../services/events.service'
import { ConfirmationDialogService } from '../modal/alert-confirm/alert-confirm.service';
import { DatasetsService } from '../edit/datasets/datasets.service';


@Component({
  selector: 'app-agent-datasets',
  templateUrl: './agent-datasets.component.html',
  styleUrls: ['./agent-datasets.component.scss']
})
export class AgentDatasetsComponent implements OnInit {

  dataSetsSelected = []
  dtsetSelected
  opSelected
  apiSelectedOperations
  serviceSelected

  @Output() dtsSelecte = new EventEmitter();

  constructor( public backendService: BackendService ,
    public functionService: FunctionService , public confirmationDialogService: ConfirmationDialogService,
    public eventsService: EventsService , public datasetsService: DatasetsService ) { }

  ngOnInit() {
  }


  /**
   * Sélection d'un dataset 
   */
  @Input()
  set dataSetsSelect(name) {
    if(name != -1 && name != 1) {
      this.dataSetsSelected = name;
      this.dtsetSelected = this.dataSetsSelected[0]
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


  /**
   * A chaque sélection d'un dataset
   * @param dts 
   */
  onSelectDataset(  dataset ){
    this.dtsetSelected = dataset
    this.dtsSelecte.emit( this.dtsetSelected )

  }


  addDataSet(){
    this.datasetsService.confirm(this.serviceSelected, this.apiSelectedOperations, this.dataSetsSelected, "new", "")
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });
  }

  editDataSet(dataset){
    this.datasetsService.confirm(this.serviceSelected, this.apiSelectedOperations, this.dataSetsSelected, "edit", dataset)
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });
  }


  deleteDataSet(dataset){

    if( this.dataSetsSelected.length == 1 ){
      this.backendService.errorsmsg( `Only one Dataset in API [${this.apiSelectedOperations.name}]. Cannot delete it!`)
      return
    }

    this.confirmationDialogService.confirm('', `Etes-vous sur de vouloir supprimer ce PARAM [${dataset.value}] ?`)
    .then((confirmed) => {
      if(confirmed){

        
        let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
        let url = `${agentUrl}delete/${this.serviceSelected.basepath}/${this.apiSelectedOperations.name}/datasets/${this.functionService.getDatsetValue( dataset.value)}`

        this.backendService.getData( url )
        .then(resultatRequest => {
          if( resultatRequest.status == 500) {
            this.backendService.errorsmsg( resultatRequest.error )
          }else {
            this.backendService.successmsg( `API [${this.apiSelectedOperations.name}] - DATASET [${dataset.value}] supprimée ` )
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
