import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service'


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
  testAndGenerationMode = false;
  yearCopyright = new Date().getFullYear()

  constructor(public eventsService: EventsService) { }

  ngOnInit() {
    this.eventsService.testAndGenerationSelected.subscribe(mode => {
      this.testAndGenerationMode = mode;
      if( !mode ) {
        this.eventsService.setReloadService(true)
        this.showSidbar = true
      }
        
    })

    this.eventsService.agentSelected.subscribe(agent => {
      this.agentSelect = agent;
    })

  }



  toggleSidebar(side){
    this.showSidbar = side
  }

  agentSelected(agent){
    //this.agentSelect = agent
  }

  clickSidebar(){
    this.showSidbar = !this.showSidbar
  }


  openEditMode(){
    this.editMode = {
      status: true,
      mode: 'createService'
    }
    this.eventsService.setTestAndGenerationSelect(false)
    this.testAndGenerationMode = false;

  }


  openTestAndGenerationMode(){
    this.eventsService.setTestAndGenerationSelect(true)
    this.testAndGenerationMode = true;
    this.showSidbar  = false;
    this.editMode = { status: false,  mode: ''}
  }



}
