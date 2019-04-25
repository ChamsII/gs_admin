import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-agent-parameters',
  templateUrl: './agent-parameters.component.html',
  styleUrls: ['./agent-parameters.component.scss']
})
export class AgentParametersComponent implements OnInit {

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

    console.log( "operationSelect paramètres", name)
    if(name != -1 && name != 1) {
      this.operationSelected = name;
      this.opSelected = this.operationSelected[0]
    }
  }



}
