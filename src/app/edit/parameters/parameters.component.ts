import { Component, OnInit , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BackendService } from '../../services/backend.service'
import { FunctionService } from '../../services/function.service'
import { of } from 'rxjs'

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit {

  @Input() serviceSelect;
  
  @Input() opSelect;
  @Input() etatOpen;
  @Input() apiSelect;
  @Input() prmsSelect;
  @Input() btnOkText;
  @Input() btnCancelText;

  parametersFroup: FormGroup
  optionsParam = []
  paramTypeFormat
  title

  constructor( private activeModal: NgbActiveModal , private _formBuilder: FormBuilder, public backendService: BackendService ,
    public functionService: FunctionService  ) { }

  ngOnInit() {
    this.parametersFroup = this._formBuilder.group({
      nameparamCtrl: [''],
      typeparamCtrl: [''],
      arg1paramCtrl: [''],
      arg2paramCtrl: ['']
    });

    of( this.functionService.getParamType() ).subscribe(type  => {
      this.optionsParam = type
      this.parametersFroup.patchValue( {typeparamCtrl : this.optionsParam[0].name } )
      this.paramTypeFormat = this.functionService.setParamTypeFormat( this.optionsParam[0].name )
    })
  }


  ngAfterContentInit() {

    if( this.etatOpen == "new" ){
      this.title = "Ajouter un paramètre "
    }else{

      this.title = `Modifier le paramètre [${this.prmsSelect.name}]` 
      let parameters = this.functionService.initParameters( this.prmsSelect )

      this.parametersFroup.patchValue( {
        typeparamCtrl: parameters.type,
        nameparamCtrl: parameters.name,
        arg1paramCtrl: parameters.arg,
        arg2paramCtrl: parameters.arg2
      } )
      this.paramTypeFormat = this.functionService.setParamTypeFormat( parameters.type )

    }
    
  }

  selectTypeChangeHandler( event : any ){
    this.paramTypeFormat = this.functionService.setParamTypeFormat( event.target.value )
  }

  public decline() {
    this.activeModal.close({status: false , service: "" });
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  accept(){
    if( this.etatOpen == "new" ){
      this.addParameters()
    }else {
      this.updateParameters();
    }
  }

  initParameter(){
    let parameters = this.functionService.initParameters( this.prmsSelect )
    parameters.name = this.parametersFroup.controls['nameparamCtrl'].value
    parameters.type = this.parametersFroup.controls['typeparamCtrl'].value
    parameters.arg = this.parametersFroup.controls['arg1paramCtrl'].value
    parameters.arg2 = this.parametersFroup.controls['arg2paramCtrl'].value
    return parameters
  }



  addParameters(){

    let parameters =  this.opSelect.parameters.map(function(val) { return val.name })
    if(parameters.includes( this.parametersFroup.controls['nameparamCtrl'].value ) ){
      this.backendService.errorsmsg( `PARAM [${this.parametersFroup.controls['nameparamCtrl'].value}] existe déjà` )
      return
    }
    
    this.opSelect.parameters.push( this.initParameter() )
    this.publishOperation();

  }

  updateParameters(){

    let parameters =  this.opSelect.parameters.map(function(val) { return val.name })
    if( this.prmsSelect.name != this.parametersFroup.controls['nameparamCtrl'].value  ) {
      if(parameters.includes( this.parametersFroup.controls['nameparamCtrl'].value ) ){
        this.backendService.errorsmsg( `PARAM [${this.parametersFroup.controls['nameparamCtrl'].value}] existe déjà` )
        return
      }
    }
    
    for(var id in this.opSelect.parameters){
      if( this.opSelect.parameters[id].name == this.prmsSelect.name ){
        this.opSelect.parameters[id] = this.initParameter()
        break;
      }
    }

    this.publishOperation();

  }

  publishOperation(){

    let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
    let url = `${agentUrl}${this.serviceSelect.basepath}/${this.apiSelect.name}/${this.opSelect.method}`

    this.backendService.postData( url , this.opSelect )
    .then(resultatRequest => {
      this.backendService.successmsg( `API [${this.apiSelect.name}] PARAM [${this.parametersFroup.controls['nameparamCtrl'].value}] enregistré ` )
      this.activeModal.close({status: true , service: resultatRequest });
    })
    .catch(error => {
      this.backendService.errorsmsg( error.message )
    })

  }



}
