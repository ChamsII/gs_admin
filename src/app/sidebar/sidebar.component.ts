import { Component, OnInit , EventEmitter , Output, Input } from '@angular/core';

import { BackendService } from '../services/backend.service';
import { FunctionService } from '../services/function.service'
import { AgentService } from '../edit/agent/agent.service';
import { ConfirmationDialogService } from '../modal/alert-confirm/alert-confirm.service';
import { EventsService } from '../services/events.service'

import { NewfilefeederService } from '../edit/newfilefeeder/newfilefeeder.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarsComponent implements OnInit {

  showSidbar = true
  resultRequest;
  agentsList = [];
  @Output() toggleSide = new EventEmitter();
  @Output() selectAgent = new EventEmitter();
  agentSelect


  @Input()
  set sidebarValue(name: boolean) {
    this.showSidbar = name;
}


  constructor(public backendService: BackendService , public functionService: FunctionService , 
    public agentService: AgentService, public confirmationDialogService: ConfirmationDialogService ,
    public eventsService: EventsService, public newfilefeederService: NewfilefeederService) { }

  ngOnInit() {

    this.getAgents();

  }


  toggleSidebar(){
    this.showSidbar = !this.showSidbar
    this.toggleSide.emit(this.showSidbar);
  }

  agentSelected(agent){
    this.agentSelect = agent
    this.functionService.setAgentSelect(agent)
    //this.selectAgent.emit(agent);
    this.eventsService.setAgentSelect(agent)
  }
  

  

  getAgents(){

    this.backendService.getAgents()
    .then(agents => {
      this.resultRequest = agents;
      this.agentsList = this.resultRequest.agents

      if(this.agentsList.length > 0){
        this.agentSelect = this.agentsList[0] 
        this.functionService.setAgentSelect( this.agentsList[0] )
        //this.selectAgent.emit(this.agentsList[0]);
        this.eventsService.setAgentSelect( this.agentsList[0] )
      }
        
    })
    .catch(errors => {
    })

  }


  
  newAgent(){
    this.agentService.confirm("new", this.agentsList[this.agentsList.length -1 ].id )
    .then((confirmed) => {
      if(confirmed.status){
        this.getAgents();
      }
    })
    .catch(() => {
    });
  }


  onRightClick( agent ){

    this.confirmationDialogService.confirm('', `Modifier l'agent ${agent.name} ?`)
    .then((confirmed) => {
      if(confirmed){

        this.functionService.setAgentSelect(agent)
        this.selectAgent.emit(agent);

        this.agentService.confirm("edit", this.agentsList[this.agentsList.length -1 ].id )
        .then((confirmed) => {
          if(confirmed.status){
            this.getAgents();
          }
        })
        .catch(() => {
        });


      }
    })
    .catch(() => {
    });

  }

  newFeeder(){
    this.newfilefeederService.confirm()
    .then((confirmed) => {

      console.log( confirmed )
      if(confirmed.status){
        
      }
    })
    .catch(() => {
    });
  }


}
