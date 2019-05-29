import { Component, OnInit , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BackendService } from '../../services/backend.service'
import { FunctionService } from '../../services/function.service'

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  @Input() serviceSelect;
  @Input() apiSelect;
  @Input() detailsSelect;
  @Input() btnOkText;
  @Input() btnCancelText;
  @Input() dataSetSelect;

  detailsFroup: FormGroup
  title

  constructor( private activeModal: NgbActiveModal , private _formBuilder: FormBuilder, public backendService: BackendService ,
    public functionService: FunctionService  ) { }

  ngOnInit() {
    this.detailsFroup = this._formBuilder.group({
      tplnameCtrl: [''],
      delayCtrl: ['', Validators.required]
    });
  }

  ngAfterContentInit() {

    this.title = `Modifier le Delay [${this.detailsSelect.delay}]` 
    this.detailsFroup.patchValue( {
      tplnameCtrl:this.functionService.getDetailDataset( this.detailsSelect.template),
      delayCtrl: parseInt( this.detailsSelect.delay )
    } )
  }

  public decline() {
    this.activeModal.close({status: false , service: "" });
  }

  public dismiss() {
    this.activeModal.dismiss();
  }


  updateDetail(){

    if( this.detailsFroup.dirty && this.detailsFroup.valid ){

      if( this.detailsFroup.controls['delayCtrl'].value == "" ){
        this.backendService.errorsmsg( "Delay obligatoire !" )
        return
      }

      let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
      let url = `${agentUrl}edit/${this.serviceSelect.basepath}/${this.apiSelect.name}/details/${this.functionService.getDatsetValue( this.dataSetSelect.value )}`

      this.backendService.postData( url , { delay: parseInt(this.detailsFroup.controls['delayCtrl'].value ) } )
      .then(resultatRequest => {
        this.backendService.successmsg( `API [${this.apiSelect.name}] DELAY [${this.detailsFroup.controls['delayCtrl'].value}] modifiée` )
        this.activeModal.close({status: true , service: resultatRequest });
      })
      .catch(error => {
        this.backendService.errorsmsg( error.message )
      })

    }else{
      this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
    }

  }



}
