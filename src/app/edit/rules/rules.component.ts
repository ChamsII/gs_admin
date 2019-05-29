import { Component, OnInit , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BackendService } from '../../services/backend.service'
import { FunctionService } from '../../services/function.service'

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  @Input() serviceSelect;
  
  @Input() opSelect;
  @Input() etatOpen;
  @Input() apiSelect;
  @Input() ruleSelect;
  @Input() btnOkText;
  @Input() btnCancelText;

  keysRulesGroup : FormGroup
  title

  constructor( private activeModal: NgbActiveModal , private _formBuilder: FormBuilder, public backendService: BackendService ,
    public functionService: FunctionService  ) { }

  ngOnInit() {
    this.keysRulesGroup = this._formBuilder.group({
      regleCtrl: [''],
      targetCtrl: ['']
    });
  }

  ngAfterContentInit() {

    if( this.etatOpen == "new" ){
      this.title = "Ajouter une clé/règle "
    }else{

      this.title = `Modifier la clé/règle [${this.ruleSelect.regle}]` 
      let cle_regle = this.functionService.initCleRegle( this.ruleSelect )
      this.keysRulesGroup.patchValue( {
        regleCtrl: cle_regle.regle,
        targetCtrl: cle_regle.target
      } )

    }
    
  }

  public decline() {
    this.activeModal.close({status: false , service: "" });
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  initRegle(){
    let cle_regle = this.functionService.initCleRegle( this.ruleSelect )
    cle_regle.regle = this.keysRulesGroup.controls['regleCtrl'].value
    cle_regle.target = this.keysRulesGroup.controls['targetCtrl'].value
    return cle_regle
  }

  accept(){
    if( this.etatOpen == "new" ){
      this.addRegle()
    }else {
      this.updateRegle();
    }
  }


  addRegle(){

    if( this.keysRulesGroup.dirty && this.keysRulesGroup.valid ){

      if( this.keysRulesGroup.controls['regleCtrl'].value == "" || this.keysRulesGroup.controls['targetCtrl'].value == ""){
        this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
        return
      }

      let regExpKeys =  this.opSelect.regExpKeys.map(function(val) { return val.name })
      if(regExpKeys.includes( this.keysRulesGroup.controls['regleCtrl'].value ) ){
        this.backendService.errorsmsg( `RGL [${this.keysRulesGroup.controls['regleCtrl'].value}] existe déjà` )
        return
      }

      this.opSelect.regExpKeys.push( this.initRegle() )
      this.publishOperation();

    }else{
      this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
    }
  }


  updateRegle(){
    if( this.keysRulesGroup.dirty && this.keysRulesGroup.valid ){

      if( this.keysRulesGroup.controls['regleCtrl'].value == "" || this.keysRulesGroup.controls['targetCtrl'].value == ""){
        this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
        return
      }

      let regExpKeys =  this.opSelect.regExpKeys.map(function(val) { return val.name })
      if( this.ruleSelect.regle != this.keysRulesGroup.controls['regleCtrl'].value  ) {
        if(regExpKeys.includes( this.keysRulesGroup.controls['regleCtrl'].value ) ){
          this.backendService.errorsmsg( `RGL [${this.keysRulesGroup.controls['regleCtrl'].value}] existe déjà` )
          return
        }
      }

      for(var id in this.opSelect.regExpKeys){
        if( this.opSelect.regExpKeys[id].regle == this.ruleSelect.regle ){
          this.opSelect.regExpKeys[id] = this.initRegle()
          break;
        }
      }

      this.publishOperation();

    }else{
      this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
    }
  }

  publishOperation(){

    let agentUrl = "http://" + this.functionService.getAgentSelect().hostname + ":" + this.functionService.getAgentSelect().admin_port + '/'
    let url = `${agentUrl}${this.serviceSelect.basepath}/${this.apiSelect.name}/${this.opSelect.method}`

    this.backendService.postData( url , this.opSelect )
    .then(resultatRequest => {
      this.backendService.successmsg( `API [${this.apiSelect.name}] RGL [${this.keysRulesGroup.controls['regleCtrl'].value}] enregistré ` )
      this.activeModal.close({status: true , service: resultatRequest });
    })
    .catch(error => {
      this.backendService.errorsmsg( error.message )
    })

  }

}
