import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  showSidbar = true
  agentSelect

  constructor() { }

  ngOnInit() {
  }



  toggleSidebar(side){
    this.showSidbar = side
  }

  agentSelected(agent){
    this.agentSelect = agent
  }

  clickSidebar(){
    this.showSidbar = !this.showSidbar
  }


}
