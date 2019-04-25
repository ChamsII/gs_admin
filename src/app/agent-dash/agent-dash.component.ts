import { Component, OnInit , Input } from '@angular/core';

@Component({
  selector: 'app-agent-dash',
  templateUrl: './agent-dash.component.html',
  styleUrls: ['./agent-dash.component.scss']
})
export class AgentDashComponent implements OnInit {

  agentSelected

  constructor() { }

  ngOnInit() {
  }

  @Input()
  set agentSelect(name) {
      this.agentSelected = name;
  }


}
