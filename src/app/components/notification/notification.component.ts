import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {ApiConstants} from "../../constants/ApiConstants";
import {Chat} from "../../models/chat";

import * as io from 'socket.io-client';
import {UserService} from "../../services/user.service";
import {ChatMessage} from "../../models/ChatMessage";
import {NotifService} from "../../services/notification.service";
//import {PushNotificationsService} from "ng-push";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  messages = [];
  connection;
  message;

  constructor(private notifService:NotifService/*, private _pushNotifications: PushNotificationsService*/) {
    //_pushNotifications.requestPermission();
  }

  /*notify(){
    let options = { //set options
      body: this.message,
      icon: "assets/images/logoSportHub.png" //adding an icon
    }
    let notify = this._pushNotifications.create('Une Nouvelle notification', options).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }*/

  sendMessage(){
    this.notifService.sendMessage(this.message);
    this.message = '';
  }
  /*
   this.socket = io(ApiConstants.REALTIME_ENDPOINT, {
   transportOptions: {
   polling: {
   extraHeaders: {
   'apikey': apikey
   // 'apikey': '42'
   }
   }
   }
   });
   this.socket.on('notification', (data) => {
   observer.next(data);
   });
   return () => {
   this.socket.disconnect();
   };
   */

  ngOnInit() {
    this.connection = this.notifService.getMessages().subscribe(message => {
      this.messages.push(message);
      //this.notify();
      console.log(this.messages);
      console.log(message);
    })
  }

  // Let's unsubscribe our Observable
  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
