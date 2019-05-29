import { Component, OnInit , Input , ViewChild , AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BackendService } from '../../services/backend.service'
import { FunctionService } from '../../services/function.service'
import { EventsService } from '../../services/events.service'

import 'brace';
import 'brace/mode/xml';
import 'brace/theme/monokai';
import 'brace/mode/json';


import { AceEditorComponent } from 'ng2-ace-editor';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements AfterViewInit {

  @ViewChild(AceEditorComponent) componetNg2?: AceEditorComponent;
  @Input() serviceSelect;
  @Input() apiSelect;
  @Input() opSelect;
  @Input() templateSelected
  @Input() dataSetsDetail;
  @Input() datasetKey;
  @Input() btnOkText;
  @Input() btnCancelText;
  modeSelected = "xml"
  themeSelected = "textmate"
  templateTextInit

  constructor( private activeModal: NgbActiveModal , public backendService: BackendService ,
    public functionService: FunctionService , public eventsService: EventsService ) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.componetNg2.setTheme( "textmate" )
  }

  ngAfterContentInit() {
    this.templateTextInit = this.templateSelected
    if( this.opSelect.responseType.search(/xml/i) > 0 ){
      this.modeSelected = "xml"
    }else{
      this.modeSelected = "json"
    }
  }

  onChange(code) {
  }

  modeSelect(mode){
    this.modeSelected = mode
  }

  public decline() {
    this.activeModal.close({status: false , service: "" });
  }

  public dismiss() {
    this.activeModal.dismiss();
  }


  setTransfert(tpr){
    if( this.opSelect.responseType.search(/xml/i) > 0 ){
      this.setText("transfert", tpr.name, "xml")
    }else{
      this.setText("transfert", tpr.name, "json")
    }
  }

  setParam(param){
    if( this.opSelect.responseType.search(/xml/i) > 0 ){
      this.setText("parameters", param.name, "xml")
    }else{
      this.setText("parameters", param.name, "json")
    }
  }


  setText(type, value, format){
    let text = ""
    if( format == "xml" ){
      text = `{{=it.${value}}}`
    }else{
      text = `{{=it.${value}}}`
    }
    this.componetNg2.getEditor().session.insert(this.componetNg2.getEditor().getCursorPosition() , text)
    this.templateSelected = this.componetNg2.getEditor().getValue()
  }

  accept(){
    if( this.templateSelected != "" ){
      this.publishModification();
    }else{
      this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
    }
  }


  publishModification(){

    let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
    let url = `${agentUrl}edittemplate/${this.serviceSelect.basepath}/${this.apiSelect.name}/${this.functionService.getDatsetValue( this.datasetKey.value )}`
    this.backendService.postData( url , {detail: this.templateSelected} )
    .then(resultatRequest => {
      if( resultatRequest.status == 500) {
        this.backendService.errorsmsg( resultatRequest.error )
      }else {
        this.backendService.successmsg( `API [${this.apiSelect.name}] TPL [${this.dataSetsDetail.template}] modifié ` )
        if( this.templateTextInit.substring(0, 1) != this.templateSelected.substring(0,1) ){
          this.updateResponseType()
        }else{
          this.activeModal.close({status: true , service: resultatRequest });
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
      let url = `${agentUrl}${this.serviceSelect.basepath}/${this.apiSelect.name}/${this.opSelect.method}`
      let responseType = this.templateSelected.substring(0,1) == '<' ? 'text/XML;charset=UTF-8' : 'text/JSON;charset=UTF-8'
      this.opSelect.responseType = responseType
      this.opSelect.delay = parseInt( this.opSelect.delay )
      this.backendService.postData( url , this.opSelect )
      .then(resultatRequest => {
        this.backendService.successmsg( `API [${this.apiSelect.name}] responseType [${responseType}] modifié ` )
        this.activeModal.close({status: true , service: resultatRequest });
      })
      .catch(error => {
        this.backendService.errorsmsg( error.message )
      })
    }
  }

}
