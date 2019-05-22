import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  showSidbar = true
  agentSelect = ""
  editMode = {
    status: false,
    mode: ''
  };

  constructor() { }

  ngOnInit() {
  }



  toggleSidebar(side){
    this.showSidbar = side
  }

  agentSelected(agent){
    this.agentSelect = agent
    console.log( this.agentSelect )
  }

  clickSidebar(){
    this.showSidbar = !this.showSidbar
  }


  openEditMode(){
    this.editMode = {
      status: true,
      mode: 'createService'
    }
  }


}
