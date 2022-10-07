import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-dois',
  templateUrl: './component-dois.component.html',
  styleUrls: ['./component-dois.component.css']
})
export class ComponentDoisComponent implements OnInit {

  nomePortal: string;

  constructor() { 
    this.nomePortal = "5"
  }

  ngOnInit(): void {
  }

}
