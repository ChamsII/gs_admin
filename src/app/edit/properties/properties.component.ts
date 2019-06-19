import { Component, OnInit , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BackendService } from '../../services/backend.service'
import { FunctionService } from '../../services/function.service'
import { of } from 'rxjs'

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {

  @Input() serviceSelect;
  @Input() opSelect;
  @Input() etatOpen;
  @Input() apiSelect;
  @Input() prmsSelect;
  @Input() btnOkText;
  @Input() btnCancelText;
  propertiesGroup: FormGroup
  formatResponse = []
  typesResponse = []
  title
  fileResponse = false

  constructor( private activeModal: NgbActiveModal , private _formBuilder: FormBuilder, public backendService: BackendService ,
    public functionService: FunctionService  ) { }

  ngOnInit() {
    this.propertiesGroup = this._formBuilder.group({
      tmpresCtrl: ['0', Validators.required ],
      formatCtrl: ['', Validators.required],
      typeCtrl: ['', Validators.required],
      fileNameCtrl: ['']
    });

    of( this.functionService.getFormatResponse() ).subscribe(formats => {
      this.formatResponse = formats
      this.propertiesGroup.patchValue( {formatCtrl : this.formatResponse[0].name } )
    })

    of( this.functionService.getTypeResponse() ).subscribe(type => {
      this.typesResponse = type
      this.propertiesGroup.patchValue( {typeCtrl : this.typesResponse[0].name } )
    })

  }


  ngAfterContentInit() {

    this.title = `Modifier les propriétés` 
    let properties = this.functionService.initProperties( this.prmsSelect )
    this.propertiesGroup.patchValue( {
      tmpresCtrl: properties.delay,
      formatCtrl: properties.responseType,
      typeCtrl: properties.reponseContent,
      fileNameCtrl: properties.fileName
    } )

    if( properties.reponseContent == "FILE")
      this.fileResponse = true
    
  }

  /***************************************** Properties  */
  selectTypeResponseChange( event : any ){
    this.fileResponse = event.target.value == "DATA" ? false: true
  }

  public decline() {
    this.activeModal.close({status: false , service: "" });
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  accept(){

    let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
    let url = `${agentUrl}${this.serviceSelect.basepath}/${this.apiSelect.name}/${this.opSelect.method}`
    this.opSelect.responseType = "text/" + this.propertiesGroup.controls['formatCtrl'].value + ";charset=UTF-8"
    this.opSelect.delay = parseInt( this.propertiesGroup.controls['tmpresCtrl'].value )
    this.opSelect.fileResponse = this.propertiesGroup.controls['typeCtrl'].value == "FILE" ? this.propertiesGroup.controls['fileNameCtrl'].value : ""

    this.backendService.postData( url , this.opSelect )
    .then(resultatRequest => {
      this.backendService.successmsg( `API [${this.apiSelect.name}] F [${this.propertiesGroup.controls['formatCtrl'].value}] D [${this.propertiesGroup.controls['tmpresCtrl'].value}] enregistré ` )
      this.activeModal.close({status: true , service: resultatRequest });
    })
    .catch(error => {
      this.backendService.errorsmsg( error.message )
    })

  }



}
