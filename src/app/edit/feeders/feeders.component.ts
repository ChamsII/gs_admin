import { Component, OnInit , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BackendService } from '../../services/backend.service'
import { FunctionService } from '../../services/function.service'

@Component({
  selector: 'app-feeders',
  templateUrl: './feeders.component.html',
  styleUrls: ['./feeders.component.scss']
})
export class FeedersComponent implements OnInit {

  @Input() serviceSelect;
  @Input() opSelect;
  @Input() etatOpen;
  @Input() apiSelect;
  @Input() fdSelect;
  @Input() btnOkText;
  @Input() btnCancelText;
  title
  feedersGroup : FormGroup
  modeSelected = "json"
  themeSelected = "monokai"
  textFeederValue: string = '[{ "fileKey":"", "baliseResponse" :"" }]'
  tabObjectFeeder = "un tableau d'objet [{fileKey: '', baliseResponse : ''}] dont : 'fileKey' : La clé dans le fichier de donnée. 'baliseResponse' : le champ à modifier dans le template response."



  constructor( private activeModal: NgbActiveModal , private _formBuilder: FormBuilder, public backendService: BackendService ,
    public functionService: FunctionService  ) { }

  ngOnInit() {
    this.feedersGroup = this._formBuilder.group({
      csvFileCtrl: [''],
      valueCtrl: [''],
      typeCtrl: ['xml'],
      isRandomCtrl: ['0']
    });
  }


  ngAfterContentInit() {
    
    if( this.etatOpen == "new" ){
      this.title = "Ajouter un Feeder"
    }else{
      this.title = `Modifier le Feeders [${this.fdSelect.csvFile}]` 
      let feeder = this.functionService.initFeeder( this.fdSelect )
      this.feedersGroup.patchValue( {
        isRandomCtrl: feeder.isRandom,
        valueCtrl: feeder.value,
        typeCtrl: feeder.type,
        csvFileCtrl: feeder.csvFile
      })
      this.textFeederValue = JSON.stringify( feeder.value )
    }
    
  }

  initFeeder(){
    let feeder = this.functionService.initFeeder( this.fdSelect )
    feeder.isRandom = this.feedersGroup.controls['isRandomCtrl'].value
    feeder.value = JSON.parse( this.feedersGroup.controls['valueCtrl'].value)
    feeder.csvFile = this.feedersGroup.controls['csvFileCtrl'].value
    return feeder
  }

  public decline() {
    this.activeModal.close({status: false , service: "" });
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  onChangeValueFeeder(feeder){
    this.feedersGroup.patchValue({valueCtrl: feeder})
  }

  publishOperation(){
    let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
    let url = `${agentUrl}${this.serviceSelect.basepath}/${this.apiSelect.name}/${this.opSelect.method}`

    this.backendService.postData( url , this.opSelect )
    .then(resultatRequest => {
      this.backendService.successmsg( `API [${this.apiSelect.name}] FD [${this.feedersGroup.controls['csvFileCtrl'].value}] enregistré ` )
      this.activeModal.close({status: true , service: resultatRequest });
    })
    .catch(error => {
      this.backendService.errorsmsg( error.message )
    })
  }

  accept(){
    if( this.etatOpen == "new" ){
      this.addFeeder()
    }else {
      this.updateFeeder();
    }
  }

  addFeeder(){

    if(!this.opSelect.feederProperties || this.opSelect.feederProperties == undefined)
      this.opSelect.feederProperties = []

    let feederProperties =  this.opSelect.feederProperties.map(function(val) { return val.csvFile })
    if(feederProperties.includes( this.feedersGroup.controls['csvFileCtrl'].value ) ){
      this.backendService.errorsmsg( `FD [${this.feedersGroup.controls['csvFileCtrl'].value}] existe déjà` )
      return
    }

    this.opSelect.feederProperties.push( this.initFeeder() )
    this.publishOperation();
    
  }

  updateFeeder(){

    let feederProperties =  this.opSelect.feederProperties.map(function(val) { return val.csvFile })
    if( this.feedersGroup.controls['csvFileCtrl'].value != this.fdSelect.csvFile ){
      if(feederProperties.includes( this.feedersGroup.controls['csvFileCtrl'].value ) ){
        this.backendService.errorsmsg( `FD [${this.feedersGroup.controls['csvFileCtrl'].value}] existe déjà` )
        return
      }
    }
    for(var id in  this.opSelect.feederProperties){
      if( this.opSelect.feederProperties[id].csvFile == this.fdSelect.csvFile){
        this.opSelect.feederProperties[id] = this.initFeeder()
        break;
      }
    }
    this.publishOperation();

  }




}
