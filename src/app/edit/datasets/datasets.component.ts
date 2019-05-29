import { Component, OnInit , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BackendService } from '../../services/backend.service'
import { FunctionService } from '../../services/function.service'

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements OnInit {

  @Input() serviceSelect;
  
  @Input() dataSetsSelected;
  @Input() etatOpen;
  @Input() apiSelect;
  @Input() dataSelect;
  @Input() btnOkText;
  @Input() btnCancelText;

  datasetsFroup: FormGroup
  title
  datasetWrited

  constructor( private activeModal: NgbActiveModal , private _formBuilder: FormBuilder, public backendService: BackendService ,
    public functionService: FunctionService  ) { }

  ngOnInit() {
    this.datasetsFroup = this._formBuilder.group({
      namedatasetCtrl: ['', Validators.required]
    });
  }

  ngAfterContentInit() {

    if( this.etatOpen == "new" ){
      this.title = "Ajouter une DataSet"
    }else{

      this.title = `Modifier la DataSet [${this.dataSelect.value}]` 
      this.datasetsFroup.patchValue( {
        namedatasetCtrl: this.functionService.getDatsetValue( this.dataSelect.value )
      } )
      this.datasetWrited = this.dataSelect.value 

    }
    
  }

  public decline() {
    this.activeModal.close({status: false , service: "" });
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  somethingChanged(){
    this.datasetWrited = `${this.apiSelect.name}-${this.datasetsFroup.controls['namedatasetCtrl'].value }` 
  }



  accept(){
    if( this.etatOpen == "new" ){
      this.addDataset()
    }else {
      this.updateDataset();
    }
  }


  addDataset(){

    if( this.datasetsFroup.dirty && this.datasetsFroup.valid ){
      if( this.datasetsFroup.controls['namedatasetCtrl'].value == "" ){
        this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
        return
      }

      let datasets =  this.dataSetsSelected.map(function(val) { return val.value })
      if(datasets.includes( this.datasetsFroup.controls['namedatasetCtrl'].value ) ){
        this.backendService.errorsmsg( `DATASET [${this.datasetsFroup.controls['namedatasetCtrl'].value}] existe déjà` )
        return
      }

      let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
      let url = `${agentUrl}add/${this.serviceSelect.basepath}/${this.apiSelect.name}/datasets/${this.datasetsFroup.controls['namedatasetCtrl'].value }`

      this.backendService.postData( url , {})
      .then(resultatRequest => {
        this.backendService.successmsg( `API [${this.apiSelect.name}] DATASET [${this.datasetsFroup.controls['namedatasetCtrl'].value}] ajoutée ` )
        this.activeModal.close({status: true , service: resultatRequest });
      })
      .catch(error => {
        this.backendService.errorsmsg( error.message )
      })

    }else{
      this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
    }

  }

  updateDataset(){

    if( this.datasetsFroup.dirty && this.datasetsFroup.valid ){
      if( this.datasetsFroup.controls['namedatasetCtrl'].value == "" ){
        this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
        return
      }

      let datasets =  this.dataSetsSelected.map(function(val) { return val.value })
      if( this.functionService.getDatsetValue( this.dataSelect.value ) != this.datasetsFroup.controls['namedatasetCtrl'].value  ) {
        if(datasets.includes( this.datasetsFroup.controls['namedatasetCtrl'].value ) ){
          this.backendService.errorsmsg( `DATASET [${this.datasetsFroup.controls['namedatasetCtrl'].value}] existe déjà` )
          return
        }
      }

      let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
      let url = `${agentUrl}edit/${this.serviceSelect.basepath}/${this.apiSelect.name}/datasets/${this.functionService.getDatsetValue( this.dataSelect.value )}`

      this.backendService.postData( url , {name: this.datasetsFroup.controls['namedatasetCtrl'].value} )
      .then(resultatRequest => {
        this.backendService.successmsg( `API [${this.apiSelect.name}] DATASET [${this.datasetsFroup.controls['namedatasetCtrl'].value}] modifiée ` )
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
