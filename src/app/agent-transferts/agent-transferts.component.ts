import { Component, OnInit , Input  } from '@angular/core';

@Component({
  selector: 'app-agent-transferts',
  templateUrl: './agent-transferts.component.html',
  styleUrls: ['./agent-transferts.component.scss']
})
export class AgentTransfertsComponent implements OnInit {

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

    console.log( "operationSelect ", name)
    if(name != -1 && name != 1) {
      this.operationSelected = name;
      this.opSelected = this.operationSelected[0]
    }
  }


}
