import { Component, OnInit , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BackendService } from '../../services/backend.service'
import { FunctionService } from '../../services/function.service'
import { of } from 'rxjs'

@Component({
  selector: 'app-transferts',
  templateUrl: './transferts.component.html',
  styleUrls: ['./transferts.component.scss']
})
export class TransfertsComponent implements OnInit {

  @Input() serviceSelect;
  @Input() opSelect;
  @Input() etatOpen;
  @Input() apiSelect;
  @Input() tpsSelect;
  @Input() btnOkText;
  @Input() btnCancelText;
  transfertsGroup : FormGroup
  transfProSource
  transfProFormat
  checkValue = {isKey: false, isUnique: false, isFeeder: false}
  title

  constructor( private activeModal: NgbActiveModal , private _formBuilder: FormBuilder, public backendService: BackendService ,
    public functionService: FunctionService  ) { }

  ngOnInit() {
    this.transfertsGroup = this._formBuilder.group({
      tpnameCtrl: [''],
      tpsourceCtrl: [''],
      tpargCtrl: [''],
      tpiskeyCtrl: [],
      tptemplateCtrl: [],
      tpisuniqCtrl: [],
      tpvalueCtrl: [],
      tpisfeederCtrl: [],
      tpfeedervalueCtrl: []
    });

    of( this.functionService.getSourceTP() ).subscribe(tps => {
      this.transfProSource = tps
      this.transfertsGroup.patchValue( {tpsourceCtrl: this.transfProSource[0].name } )
      this.setSourceFormat( 'BODY_XPATH' )
    })

  }

  ngAfterContentInit() {
    console.log( this.serviceSelect )
    console.log( this.opSelect )
    console.log( this.etatOpen )
    console.log( this.apiSelect )
    console.log( this.tpsSelect )
    
    if( this.etatOpen == "new" ){
      this.title = "Ajouter un transfert properties "
    }else{
      this.title = `Modifier le transfert properties [${this.tpsSelect.name}]` 
      let tansfert = this.functionService.initTransfertProperties( this.tpsSelect )
      this.transfertsGroup.patchValue({
        tpnameCtrl: tansfert.name,
        tpsourceCtrl: tansfert.source,
        tpargCtrl: tansfert.path,
        tpiskeyCtrl: tansfert.isKey,
        tptemplateCtrl: tansfert.template,
        tpisuniqCtrl: tansfert.isUnique,
        tpvalueCtrl: tansfert.value,
        tpisfeederCtrl: tansfert.isFeeder,
        tpfeedervalueCtrl: tansfert.feederName
      })
    }
    
  }

  setSourceFormat(sourceValue){
    this.transfProFormat = this.functionService.getSourseFormat(sourceValue);
  }
  selectSourceChangeHandler( event : any ){
    this.setSourceFormat( event.target.value )
  }

  checkValueIsUnique( event : any  ) {
    this.checkValue.isUnique = event.target.checked 
  }

  checkValueIsKey( event : any  ) {
    this.checkValue.isKey = event.target.checked 
  }

  checkValueIsFeeder( event : any  ) {
    this.checkValue.isFeeder = event.target.checked 
  }

  public decline() {
    this.activeModal.close({status: false , service: "" });
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  accept(){
    if( this.etatOpen == "new" ){
      this.addTransfert()
    }else {
      this.updateTransfert();
    }
  }

  initTransfert(){

    let transfert = this.functionService.initTransfertProperties( this.tpsSelect )
    transfert.name = this.transfertsGroup.controls['tpnameCtrl'].value
    transfert.source = this.transfertsGroup.controls['tpsourceCtrl'].value
    transfert.path = this.transfertsGroup.controls['tpargCtrl'].value
    transfert.isKey = this.transfertsGroup.controls['tpiskeyCtrl'].value
    transfert.template = this.transfertsGroup.controls['tptemplateCtrl'].value
    transfert.isUnique = this.transfertsGroup.controls['tpisuniqCtrl'].value
    transfert.value = this.transfertsGroup.controls['tpvalueCtrl'].value
    transfert.isFeeder = this.transfertsGroup.controls['tpisfeederCtrl'].value
    transfert.feederName = this.transfertsGroup.controls['tpfeedervalueCtrl'].value
    return transfert

  }

  updateTransfert(){
    let transferProperties =  this.opSelect.transferProperties.map(function(val) { return val.name })
    if( this.tpsSelect.name != this.transfertsGroup.controls['tpnameCtrl'].value  ) {
      if(transferProperties.includes( this.transfertsGroup.controls['tpnameCtrl'].value ) ){
        this.backendService.errorsmsg( `TP [${this.transfertsGroup.controls['tpnameCtrl'].value}] existe déjà` )
        return
      }
    }
    
    for(var id in this.opSelect.transferProperties){
      if( this.opSelect.transferProperties[id].name == this.tpsSelect.name ){
        this.opSelect.transferProperties[id] = this.initTransfert()
        break;
      }
    }

    if( this.tpsSelect.isKey != this.transfertsGroup.controls['tpiskeyCtrl'].value ){
      if( this.transfertsGroup.controls['tpiskeyCtrl'].value ){
        this.opSelect.keys.push( this.transfertsGroup.controls['tpnameCtrl'].value )
      }else {
        for(var id in this.opSelect.keys){
          if(this.opSelect.keys[id] == this.tpsSelect.name ){
            this.opSelect.keys.splice(id, 1)
            break;
          }
        }
      }
    }else if( this.tpsSelect.isKey == this.transfertsGroup.controls['tpiskeyCtrl'].value && 
    this.transfertsGroup.controls['tpiskeyCtrl'].value && this.tpsSelect.name == this.transfertsGroup.controls['tpnameCtrl'].value ) {
      for(var id in this.opSelect.keys){
        if(this.opSelect.keys[id] == this.tpsSelect.name ){
          this.opSelect.keys[id] = this.transfertsGroup.controls['tpnameCtrl'].value
          break;
        }
      }
    }

    this.publishOperation();

  }

  addTransfert(){

    let transferProperties =  this.opSelect.transferProperties.map(function(val) { return val.name })
    if(transferProperties.includes( this.transfertsGroup.controls['tpnameCtrl'].value ) ){
      this.backendService.errorsmsg( `TP [${this.transfertsGroup.controls['tpnameCtrl'].value}] existe déjà` )
      return
    }
    
    if( this.transfertsGroup.controls['tpiskeyCtrl'].value )
      this.opSelect.keys.push( this.transfertsGroup.controls['tpnameCtrl'].value )
    
    this.opSelect.transferProperties.push( this.initTransfert() )
    this.publishOperation();

  }

  publishOperation(){

    let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
    let url = `${agentUrl}${this.serviceSelect.basepath}/${this.apiSelect.name}/${this.opSelect.method}`

    this.backendService.postData( url , this.opSelect )
    .then(resultatRequest => {
      this.backendService.successmsg( `API [${this.apiSelect.name}] TP [${this.transfertsGroup.controls['tpnameCtrl'].value}] ajouté ` )
      this.activeModal.close({status: true , service: resultatRequest });
    })
    .catch(error => {
      this.backendService.errorsmsg( error.message )
    })

  }



}
