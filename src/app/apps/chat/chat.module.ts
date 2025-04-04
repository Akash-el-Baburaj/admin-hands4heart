import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';

// modules
import { WidgetModule } from '../../shared/widget/widget.module';
import { PageTitleModule } from '../../shared/page-title/page-title.module';
import { ChatRoutingModule } from './chat-routing.module';

// components
import { ChatComponent } from './chat.component';
import { ChatUsersComponent } from './chat-users/chat-users.component';
import { ChatAreaComponent } from './chat-area/chat-area.component';
import { ChatProfileComponent } from './chat-profile/chat-profile.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxDropzoneModule } from 'ngx-dropzone';



@NgModule({
  declarations: [
    ChatComponent,
    ChatUsersComponent,
    ChatAreaComponent,
    ChatProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    PageTitleModule,
    WidgetModule,
    ChatRoutingModule,
    ReactiveFormsModule,
    NgxDropzoneModule
  ]
})
export class ChatModule { }
