import { Component, OnInit , Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BackendService } from '../../services/backend.service'
import { FunctionService } from '../../services/function.service'


@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {

  agentGroup: FormGroup
  title
  @Input() etatOpen;
  @Input() totalAgent;
  checkValueDocker = false
  total_agent
  resultatRequest

  constructor( private activeModal: NgbActiveModal , private _formBuilder: FormBuilder, public backendService: BackendService ,
    public functionService: FunctionService  ) { }

  ngOnInit() {
    this.agentGroup = this._formBuilder.group({
      nameCtrl: ['', Validators.required ],
      hostnameCtrl: ['', Validators.required],
      adminportCtrl: ['', Validators.required ],
      agentportCtrl: ['', Validators.required],
      dockerCtrl: [false]
    });
  }


  ngAfterContentInit() {

    if( this.etatOpen == "edit" ){
      this.title = `Mise à jour des agents` 
      this.checkValueDocker = this.functionService.getAgentSelect().docker
      this.agentGroup.patchValue( {
        nameCtrl: this.functionService.getAgentSelect().name,
        hostnameCtrl: this.functionService.getAgentSelect().hostname,
        adminportCtrl: this.functionService.getAgentSelect().admin_port,
        agentportCtrl: this.functionService.getAgentSelect().agent_port,
        dockerCtrl: this.functionService.getAgentSelect().docker,
      } )
    }else{
      this.title = `Ajout d'un nouvel agent` 
    }

  }

  checkValueIsUnique( event : any  ) {
    this.checkValueDocker = event.target.checked 
  }

  public decline() {
    this.activeModal.close({status: false , service: "" });
  }

  public dismiss() {
    this.activeModal.dismiss();
  }


  accept(){

    if( this.agentGroup.dirty && this.agentGroup.valid ){

      if( this.agentGroup.controls['nameCtrl'].value == "" || this.agentGroup.controls['hostnameCtrl'].value == "" ||
      this.agentGroup.controls['adminportCtrl'].value == "" || this.agentGroup.controls['agentportCtrl'].value == ""){
        this.backendService.errorsmsg( "Les champs name et arg sont obligatoires !" )
        return
      }

      this.backendService.getNbrAgent()
      .then(total_agent => {
        this.total_agent = total_agent

        let id_encour
        if( this.etatOpen == "edit" ){
          id_encour = this.functionService.getAgentSelect().id
        }else{
          if( this.total_agent.nbrAgent ){
            id_encour = parseInt( this.total_agent.nbrAgent) + 1
          }else{
            id_encour = parseInt( this.totalAgent ) + 1
          }
        }

        let agent = {
          "id": id_encour,
          "name": this.agentGroup.controls['nameCtrl'].value,
          "hostname": this.agentGroup.controls['hostnameCtrl'].value,
          "admin_port": this.agentGroup.controls['adminportCtrl'].value,
          "agent_port": this.agentGroup.controls['agentportCtrl'].value,
          "docker": this.checkValueDocker
        }

        this.backendService.postAgent(agent)
        .then(resultat => {
          this.resultatRequest = resultat
          if( this.resultatRequest.message == 'saving'){
            this.backendService.successmsg("Agent successfully saving")
            this.activeModal.close({status: true , service: "" });
          }else{
            this.backendService.errorsmsg( "Update Agent error!" )
            this.activeModal.close({status: false , service: "" });
          }
        })
        .catch(errors => {
        })

      })
      .catch(errors => {
      })

    }else{
      this.backendService.errorsmsg( "Tous les champs sont obligatoires !" )
    }

  }



}
