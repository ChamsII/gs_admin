import { Component, OnInit , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BackendService } from '../../services/backend.service'
import { FunctionService } from '../../services/function.service'

@Component({
  selector: 'app-newfilefeeder',
  templateUrl: './newfilefeeder.component.html',
  styleUrls: ['./newfilefeeder.component.scss']
})
export class NewfilefeederComponent implements OnInit {


  @Input() btnOkText;
  @Input() btnCancelText;

  feedersGroup : FormGroup
  modeSelected = "text"
  themeSelected = "monokai"
  textFeederValue: string = ""

  constructor( private activeModal: NgbActiveModal , private _formBuilder: FormBuilder, public backendService: BackendService ,
    public functionService: FunctionService  ) { }

  ngOnInit() {
    this.feedersGroup = this._formBuilder.group({
      csvFileCtrl: ['', Validators.required]
    });
  }

  getFileExtension(filename) {
    //(this.feedersGroup.controls['csvFileCtrl'].value).split('.').pop()
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }

  public decline() {
    this.activeModal.close({status: false});
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  accept(){

    if( this.feedersGroup.controls['csvFileCtrl'].value == "" ) {
      this.backendService.errorsmsg( `FD [Csv File] est vide ` )
      return
    }
    if( this.textFeederValue == "" ) {
      this.backendService.errorsmsg( `Contenu du fichier CSV de données non renseigné ` )
      return
    }

    var nom_fichier = ""
    if( this.getFileExtension( this.feedersGroup.controls['csvFileCtrl'].value)  != "csv" ) {
      nom_fichier = this.feedersGroup.controls['csvFileCtrl'].value + ".csv"
    }else{
      nom_fichier = this.feedersGroup.controls['csvFileCtrl'].value
    }

    let feeder = {
      name : nom_fichier,
      value : this.textFeederValue
    }
    let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
    let url = `${agentUrl}addFeeder`

    this.backendService.postData( url , feeder )
    .then(resultatRequest => {
      this.backendService.successmsg( `FEEDER [${feeder.name}] enregistré ` )
      this.activeModal.close({status: true });
    })
    .catch(error => {
      this.backendService.errorsmsg( error.message )
      this.activeModal.close({status: false });
    })


  }


}
