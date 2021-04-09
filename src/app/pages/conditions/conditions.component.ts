import { Component, OnInit } from '@angular/core';
import { faCloudShowersHeavy, faLeaf, faCloudSun } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css']
})
export class ConditionsComponent implements OnInit {
  rainIcon = faCloudShowersHeavy;
  leafIcon = faLeaf;
  sunCloudIcon = faCloudSun;

  constructor() { }

  ngOnInit(): void {
  }

}
