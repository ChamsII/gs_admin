import { Component, OnInit , Input , ViewChild } from '@angular/core';

import { FunctionService } from '../services/function.service'
import { BackendService } from '../services/backend.service'
import { EventsService } from '../services/events.service'
import { TemplateService } from '../edit/template/template.service';

import 'brace';
import 'brace/mode/xml';
import 'brace/mode/html';
import 'brace/mode/text';
import 'brace/theme/monokai';
import 'brace/mode/json';
import { of } from 'rxjs'

@Component({
  selector: 'app-agent-template',
  templateUrl: './agent-template.component.html',
  styleUrls: ['./agent-template.component.scss']
})
export class AgentTemplateComponent implements OnInit {

  templateSelected : string = ""
  templateTextInit : string = ""
  modeSelected = "xml"
  themeSelected = "textmate"
  dataSetsDetail
  datasetKey
  editStart = false;
  apiSelectedOperations
  serviceSelected
  opSelect

  formatResponse = []
  modelSelectFormt = "XML"


  constructor(public backendService: BackendService , public functionService: FunctionService , public eventsService: EventsService ,
    public templateService: TemplateService ) { }

  ngOnInit() {

    of( this.functionService.getFormatResponse() ).subscribe(formats => {
      this.formatResponse = formats
      //this.formatResponse[0].name
    })

    this.eventsService.opSelected.subscribe(opSelect => {
      this.opSelect = opSelect
      if( this.opSelect.responseType.search(/xml/i) > 0 ){
        this.modeSelected = "xml"
        this.modelSelectFormt = "XML"
      }else if( this.opSelect.responseType.search(/json/i) > 0 ){
        this.modeSelected = "json"
        this.modelSelectFormt = "JSON"
      }else if( this.opSelect.responseType.search(/html/i) > 0 ){
        this.modeSelected = "html"
        this.modelSelectFormt = "HTML"
      }else{
        this.modeSelected = "text"
        this.modelSelectFormt = "TXT"
      }
    })
  }

  /**
   * Sélection d'un dataset 
   */
  @Input()
  set templateSelect(name) {
    this.templateSelected = name;
    this.templateTextInit = name
  }

  @Input()
  set dataSetsSelect(name) {
    this.dataSetsDetail = name;
  }

  @Input()
  set datasetKeySelect(name) {
    this.datasetKey = name;
  }

  @Input()
  set apiSelect(name) {
    this.apiSelectedOperations = name;
  }

  @Input()
  set serviceSelect(name) {
    if(name != -1 && name != 1) {
      this.serviceSelected = name;
    }
  }


  onChange(code) {
    if( this.templateTextInit != this.templateSelected )
      this.editStart = true
  }

  modeSelect(mode){
    this.editStart = true
    if( mode.toLowerCase() == "txt" )
      this.modeSelected =  "text"
    else
      this.modeSelected =  mode.toLowerCase()
  }

  resizeFull(){
    this.templateService.confirm(this.serviceSelected, this.apiSelectedOperations, this.opSelect, this.templateSelected, this.dataSetsDetail, this.datasetKey )
    .then((confirmed) => {
      if(confirmed.status){
        this.serviceSelected = confirmed.service
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      }
    })
    .catch(() => {
    });
  }

  valideChange(){
    if( this.templateSelected != "" ){
      this.publishModification();
    }else{
      this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
    }
  }

  publishModification(){

    let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
    let url = `${agentUrl}edittemplate/${this.serviceSelected.basepath}/${this.apiSelectedOperations.name}/${this.functionService.getDatsetValue( this.datasetKey.value )}`

    this.backendService.postData( url , {detail: this.templateSelected} )
    .then(resultatRequest => {
      if( resultatRequest.status == 500) {
        this.backendService.errorsmsg( resultatRequest.error )
      }else {
        this.backendService.successmsg( `API [${this.apiSelectedOperations.name}] TPL [${this.dataSetsDetail.template}] modifié ` )
        this.serviceSelected = resultatRequest
        this.editStart = false
        if( this.templateTextInit.substring(0, 1) != this.templateSelected.substring(0,1) ){
          this.updateResponseType()
        }else{
          this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
        }
      }
      
    })
    .catch(error => {
      this.backendService.errorsmsg( error.message )
    })

  }

  updateResponseType(){
    if( this.templateTextInit.substring(0, 1) != this.templateSelected.substring(0,1) ){

      let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
      let url = `${agentUrl}${this.serviceSelected.basepath}/${this.apiSelectedOperations.name}/${this.opSelect.method}`
      let responseType = this.templateSelected.substring(0,1) == '<' ? 'text/XML;charset=UTF-8' : 'text/JSON;charset=UTF-8'
      this.opSelect.responseType = responseType
      this.opSelect.delay = parseInt( this.opSelect.delay )

      this.backendService.postData( url , this.opSelect )
      .then(resultatRequest => {
        this.backendService.successmsg( `API [${this.apiSelectedOperations.name}] responseType [${responseType}] modifié ` )
        this.serviceSelected = resultatRequest
        this.eventsService.setApiSelect( this.serviceSelected.apis[0] )
      })
      .catch(error => {
        this.backendService.errorsmsg( error.message )
      })
    }
  }




}
