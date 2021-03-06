import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationsService } from 'angular2-notifications';
import { Customer, CustomerService, Interview, InterviewService, Snippet, UserService } from '../../shared';
import { SnippetMenuConfig } from '../snippets/snippet-menu-config.model';
import { SnippetModalComponent } from '../snippets/snippet-modal.component';

// todo: implement CanDeactivate https://angular.io/docs/ts/latest/guide/router.html#!#can-deactivate-guard
@Component({
  selector: 'app-interview-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  search: string;
  interview: Interview = new Interview();
  customer: Customer = new Customer();
  isSubmitting: boolean = false;
  userId: any;
  snippetMenuConfig: SnippetMenuConfig = new SnippetMenuConfig();
  snippet: Snippet;

  constructor(
    private modalService: NgbModal,
    private customerService: CustomerService,
    private interviewService: InterviewService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    // load prefetched interview
    this.route.data.subscribe(
      (data: {interview: Interview}) => {
        if (data.interview) {
          this.interview = data.interview;
          this.getMetaData();
        }
      }
    );

    this.userService.currentUser.subscribe(
      user => {
        if (this.interview && this.interview.id) {
          this.interview.updated_by = user.username;
        } else {
          this.interview.created_by = user.username;
        }
      }
    );
  }

  getMetaData() {
    this.interviewService.customer(this.interview.id)
    .subscribe(
      data => {
          this.customer = data;
          this.search = data.email;
        },
        err => {
          this.notificationsService
          .error('Oops', `There was problem retrieving your "${this.interview.title}" interview. ${err.message}`);
        }
    );
  }

  save() {
    // check if interview is new or exists.
    let serviceCall: Observable<any>;
    let insert: boolean;
    if (this.interview && this.interview.id) {
      serviceCall = this.interviewService.put(this.interview);
      insert = false;
    } else {
      serviceCall = this.interviewService.post(this.interview);
       insert = true;
    }
    serviceCall.subscribe(
        data => {
          console.log('interview saved.' + data);
          this.interview.id = this.interview.id || data.interview_id;
          if (insert) {
            this.notificationsService.success('Saved', 'Interview saved successfully!');
          } else {
            this.notificationsService.success('Updated', 'Interview updated successfully!');
          }

          this.saveMetaData();
        },
        err => {
          this.notificationsService
          .error('Oops', `There was problem saving your "${this.interview.title}" interview. ${err.message}`);
        }
      );
  }

  saveMetaData() {
    // check if customer is new.
    if (this.customer && (!this.customer.hasOwnProperty('id') || this.customer.id === 0)) {
      this.customerService.post(this.customer).subscribe(
        data => {
          console.log('customer saved.');
          this.customer.id = data.customer_id;
          this.assignCustomer(this.interview.id, this.customer.id);
        },
        err => {
          this.notificationsService
          .error('Oops', `There was problem saving your "${this.interview.title}" interview's customer. ${err.message}`);
        }
      );
    } else if (this.customer && !this.customer.assigned) {
      this.assignCustomer(this.interview.id, this.customer.id);
    }
  }

  assignCustomer(interview_id: number, customer_id: number) {
    this.interviewService.assign(interview_id, customer_id).subscribe(
      data => {
        console.log('customer assigned.');
        this.customer.assigned = true;
      },
      err => {
        this.notificationsService
          .error('Oops', `There was problem saving your "${this.interview.title}" interview's customer. ${err.message}`);
      }
    );
  }

  snippetSelected(data: any) {
    this.snippetMenuConfig.top = data.position.rect.top;
    this.snippetMenuConfig.left = data.position.rect.left;
    this.snippetMenuConfig.display = true;

    this.snippet = new Snippet();
    this.snippet.interview_id = this.interview.id;
    this.snippet.text = data.text;
  }

  snippetDeselected() {
    this.snippetMenuConfig.display = false;
  }

  makeSnippet(data: any) {
    this.snippetMenuConfig.display = false;
    const modalRef = this.modalService.open(SnippetModalComponent);
    modalRef.componentInstance.snippet = this.snippet;
  }

}
