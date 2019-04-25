import { Component, OnInit , Input } from '@angular/core';

@Component({
  selector: 'app-agent-feeders',
  templateUrl: './agent-feeders.component.html',
  styleUrls: ['./agent-feeders.component.scss']
})
export class AgentFeedersComponent implements OnInit {

  operationSelected = []
  opSelected

  constructor() { }

  ngOnInit() {
  }


   /**
   * Sélection d'un agent 
   */
  @Input()
  set operationSelect(name) {

    console.log( "operationSelect Feeder ", name)
    if(name != -1 && name != 1) {
      this.operationSelected = name;
      this.opSelected = this.operationSelected[0]
    }
  }



}
