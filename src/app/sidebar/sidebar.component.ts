import { Component, OnInit , EventEmitter , Output, Input } from '@angular/core';

import { BackendService } from '../services/backend.service';

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


  @Input()
  set sidebarValue(name: boolean) {
    this.showSidbar = name;
}


  constructor(public backendService: BackendService) { }

  ngOnInit() {

    this.getAgents();

  }


  toggleSidebar(){
    this.showSidbar = !this.showSidbar
    this.toggleSide.emit(this.showSidbar);
  }

  agentSelected(agent){
    this.selectAgent.emit(agent);
  }
  


  getAgents(){

    this.backendService.getAgents()
    .then(agents => {
      this.resultRequest = agents;
      this.agentsList = this.resultRequest.agents

      if(this.agentsList.length > 0)
        this.selectAgent.emit(this.agentsList[0]);
    })
    .catch(errors => {
      console.log(errors)
    })

  }


  


  newAgent(){
    console.log("add")
  }

}
