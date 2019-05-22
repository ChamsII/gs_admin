import { Component, OnInit , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BackendService } from '../../services/backend.service'
import { FunctionService } from '../../services/function.service'
import { of } from 'rxjs'


@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit {

  
  @Input() serviceSelect;
  @Input() opSelect;
  @Input() etatOpen;
  @Input() apiSelect;
  apiOpGroup : FormGroup
  methodOperations
  title

  constructor( private activeModal: NgbActiveModal , private _formBuilder: FormBuilder, public backendService: BackendService ,
    public functionService: FunctionService  ) { }

  ngOnInit() {
    this.apiOpGroup = this._formBuilder.group({
      methodCtrl: ['', Validators.required]
    });

    //Async method
    of( this.functionService.getMethods() ).subscribe(methods => {
      this.methodOperations = methods
      this.apiOpGroup.patchValue({methodCtrl: this.methodOperations[0].name})
    })


  }

  ngAfterContentInit() {
    
    if( this.etatOpen == "new" ){
      this.title = "Nouvelle operation "
    }else{
      this.title = `Mise à jour operation [${this.opSelect.method}]` 
      this.apiOpGroup.patchValue({
        methodCtrl: this.opSelect.method,
      })
    }
    
  }

  public decline() {
    this.activeModal.close({status: false , service: "" });
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  accept(){
    if( this.etatOpen == "new" ){
      this.addOperation()
    }else {
      this.updateOperation();
    }
  }


  addOperation(){
    let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
    let url = `${agentUrl}add/${this.serviceSelect.basepath}/${this.apiSelect.name}/${this.apiOpGroup.controls['methodCtrl'].value}`
    let new_operation = this.functionService.getNewOperation( this.apiOpGroup.controls['methodCtrl'].value );
    this.backendService.postData( url , new_operation )
    .then(resultatRequest => {
      this.backendService.successmsg( `API [${this.apiSelect.name}] Opération [${this.apiOpGroup.controls['methodCtrl'].value}] ajoutée ` )
      this.activeModal.close({status: true , service: resultatRequest });
    })
    .catch(error => {
      this.backendService.errorsmsg( error.message )
    })
  }


  updateOperation(){

    if( this.opSelect.method == this.apiOpGroup.controls['methodCtrl'].value ) {
      return
    }

    let opsNames =  this.apiSelect.operations.map(function(val) { return val.name })
    if(opsNames.includes( this.apiOpGroup.controls['methodCtrl'].value ) ){
      this.backendService.errorsmsg( `Opération [${this.apiOpGroup.controls['methodCtrl'].value}] existe déjà` )
      return
    }

    let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
    let url = `${agentUrl}${this.serviceSelect.basepath}/${this.apiSelect.name}/${this.opSelect.method}`

    let last_op_name = this.opSelect.method
    this.opSelect.method = this.apiOpGroup.controls['methodCtrl'].value
    this.backendService.postData( url , this.opSelect )
    .then(resultatRequest => {
      this.backendService.successmsg( `API [${this.apiSelect.name}] Opération [${last_op_name}] modifiée ` )
      this.activeModal.close({status: true , service: resultatRequest });
    })
    .catch(error => {
      this.backendService.errorsmsg( error.message )
    })

  }

}
