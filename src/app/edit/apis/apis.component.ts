import { Component, OnInit , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BackendService } from '../../services/backend.service'
import { FunctionService } from '../../services/function.service'

@Component({
  selector: 'app-apis',
  templateUrl: './apis.component.html',
  styleUrls: ['./apis.component.scss']
})
export class ApisComponent implements OnInit {

  @Input() serviceSelect;
  @Input() apiSelect;
  apiOpGroup : FormGroup
  methodOperations
  title


  constructor(private activeModal: NgbActiveModal , private _formBuilder: FormBuilder, public backendService: BackendService ,
    public functionService: FunctionService ) { }

  ngOnInit() {
    this.apiOpGroup = this._formBuilder.group({
      apiopCtrl: ['default', Validators.required ],
      urlCtrl: ['/', Validators.required]
    });

  }

  ngAfterContentInit() {
    this.apiOpGroup.patchValue({
      urlCtrl: this.apiSelect.uri,
      apiopCtrl: this.apiSelect.name
    })
  }


  public decline() {
    this.activeModal.close({status: false , service: "" });
  }

  public accept() {
    if( this.apiOpGroup.controls['apiopCtrl'].value == this.apiSelect.name && this.apiOpGroup.controls['urlCtrl'].value == this.apiSelect.uri ) {
      return
    }

    let apiNames = this.serviceSelect.apis.map(function(val) { return val.name })
    if(apiNames.includes( this.apiOpGroup.controls['apiopCtrl'].value ) ){
      this.backendService.errorsmsg( `API [${this.apiOpGroup.controls['apiopCtrl'].value}] existe déjà` )
      return
    }

    let apiUrls = this.serviceSelect.apis.map(function(val) { return val.uri })
    if(apiUrls.includes( this.apiOpGroup.controls['urlCtrl'].value ) ){
      this.backendService.errorsmsg( `API URL [${this.apiOpGroup.controls['urlCtrl'].value}] existe déjà` )
      return
    }

    let api_old_name = this.apiSelect.name
    this.apiSelect.name = this.apiOpGroup.controls['apiopCtrl'].value
    this.apiSelect.uri = this.apiOpGroup.controls['urlCtrl'].value
    this.publishApi(api_old_name);

  }

  publishApi(api_old_name){
    
    let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
    let url = `${agentUrl}${this.serviceSelect.basepath}/${api_old_name}`
    this.backendService.postData( url , this.apiSelect )
    .then(resultatRequest => {
      this.backendService.successmsg( "API [" + this.apiOpGroup.controls['apiopCtrl'].value + "] modifiée" )
      this.activeModal.close({status: true , service: resultatRequest });
    })
    .catch(error => {
      this.backendService.errorsmsg( error.message )
    })
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}
