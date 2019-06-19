import { Injectable } from '@angular/core';
import { Output , EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class EventsService {

    @Output() apiSelected = new EventEmitter();
    apiSelecte

    @Output() serviceSelected = new EventEmitter();
    serviceSelect

    @Output() editMode = new EventEmitter();
    editModeSet

    @Output() opSelected = new EventEmitter();
    opSelect

    @Output() testAndGenerationSelected = new EventEmitter();
    testAndGenerationSelect

    @Output() reloadService = new EventEmitter();
    serviceReload = false

    @Output() agentSelected = new EventEmitter();
    agentSelect


    setAgentSelect(agent){
        this.agentSelect = agent
        this.agentSelected.emit( this.agentSelect )
    }

    setApiSelect(api){
        this.apiSelecte = api
        this.apiSelected.emit( this.apiSelecte )
    }

    setServiceSelect(srv){
        this.serviceSelect = srv
        this.serviceSelected.emit( this.serviceSelect )
    }

    setEditMode(editmode){
        this.editModeSet = editmode
        this.editMode.emit( this.editModeSet )
    }

    setOpSelecte(op){
        this.opSelect = op
        this.opSelected.emit( this.opSelect )
    }

    setTestAndGenerationSelect(mode){
        this.testAndGenerationSelect = mode
        this.testAndGenerationSelected.emit( this.testAndGenerationSelect )
    }

    setReloadService(reload){
        this.serviceReload = reload
        this.reloadService.emit( this.agentSelect )
    }




}