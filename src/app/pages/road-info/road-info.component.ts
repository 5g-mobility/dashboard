import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-road-info',
  templateUrl: './road-info.component.html',
  styleUrls: ['./road-info.component.scss']
})
export class RoadInfoComponent implements OnInit {

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  ngOnInit(): void {
    var speedCanvas = document.getElementById("dailyInflowTraffic");

    var dataEventNumber = {
      data: [0, 19, 15, 20, 30, 40, 40, 50, 25, 30, 50, 70, 0,
        19, 15, 20, 30, 40, 40, 50, 25, 30, 50, 70, 50, 20, 60,
        55, 76, 34, 21],
      fill: false,
      label: 'Max Number of Cars - Praia da Barra',
      borderColor: '#fbc658',
      backgroundColor: 'transparent',
      pointBorderColor: '#fbc658',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8,
    };

    var dataTopSpeed = {
      data: [150, 120, 95, 200, 220, 300, 93, 97, 100, 110, 99, 91, 102,
        145, 185, 170, 160, 112, 133, 141, 121, 105, 100, 96, 95, 91, 93,
        92, 97, 94, 91],
      fill: false,
      label: 'Max Number of Cars - Costa Nova',
      borderColor: '#51CACF',
      backgroundColor: 'transparent',
      pointBorderColor: '#51CACF',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8
    };

    var dailyData = {
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
        "31"],
      datasets: [dataEventNumber, dataTopSpeed]
    };

    var chartOptions = {
      legend: {
        display: true,
        position: 'bottom',
      }
    };

    var lineChart = new Chart(speedCanvas, {
      type: 'line',
      hover: false,
      data: dailyData,
      options: chartOptions,
    });
  }

}
