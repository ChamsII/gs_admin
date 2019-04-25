import { Component, OnInit , Input } from '@angular/core';

@Component({
  selector: 'app-agent-properties',
  templateUrl: './agent-properties.component.html',
  styleUrls: ['./agent-properties.component.scss']
})
export class AgentPropertiesComponent implements OnInit {

  operationSelected = []
  opSelected
  responseSelected

  constructor() { }

  ngOnInit() {
  }


   /**
   * Sélection d'un agent 
   */
  @Input()
  set operationSelect(name) {

    console.log( "operationSelect paramètres", name)
    if(name != -1 && name != 1) {
      this.operationSelected = name;
      this.opSelected = this.operationSelected[0]
    }
  }

  @Input()
  set responseSelect(name) {

    console.log( "responseSelect ", name)
    if(name != -1 && name != 1) {
      this.responseSelected = name;
    }
  }


}
