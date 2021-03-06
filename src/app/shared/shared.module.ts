import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import {MomentModule} from 'angular2-moment';

import { CardFooterCreatedComponent } from './card-helpers';
import { CustomerLookupComponent } from './customer-lookup';
import { ShowAuthedDirective, ContenteditableModelDirective } from './directives';
import { IdeaPreviewComponent } from './idea-helpers';
import { InterviewPreviewComponent } from './interview-helpers';
import { SnippetPreviewComponent, SnippetPreviewListComponent, SnippetIdeaListComponent } from './snippet-helpers/';


//import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    MomentModule,
    RouterModule
  ],
  declarations: [
    CardFooterCreatedComponent,
    ContenteditableModelDirective,
    CustomerLookupComponent,
    IdeaPreviewComponent,
    InterviewPreviewComponent,
    ShowAuthedDirective,
    SnippetPreviewComponent,
    SnippetPreviewListComponent,
    SnippetIdeaListComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpModule,
    MomentModule,
    RouterModule,
    CardFooterCreatedComponent,
    ContenteditableModelDirective,
    CustomerLookupComponent,
    IdeaPreviewComponent,
    InterviewPreviewComponent,
    ShowAuthedDirective,
    SnippetPreviewComponent,
    SnippetPreviewListComponent,
    SnippetIdeaListComponent
  ]
})
export class SharedModule { }
