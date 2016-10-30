import { Component, OnInit } from '@angular/core';

import { Idea, IdeaService } from '../shared';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  ideas: Idea[];

  constructor(
    private ideaService: IdeaService
  ) { }

  ngOnInit() {
    this.ideaService.get()
    .subscribe(
        data => {
          this.ideas = data;
          console.log(this.ideas);
        },
        err => {
          console.log(err);
        }
      );
  }

}
