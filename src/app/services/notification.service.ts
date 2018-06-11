/**
 * Created by rael on 04/12/2017.
 */
import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Sport} from "../models/sport";
import {ApiConstants} from "../constants/ApiConstants";
import {Chat} from "../models/chat";
import {ChatMessage} from "../models/ChatMessage";
import {UserService} from "./user.service";
import * as io from 'socket.io-client';

@Injectable()
export class NotifService {

    constructor(private userService: UserService) {}


  private socket;

  sendMessage(message){
    this.socket.emit('add-message', message);
  }

  getMessages() {
    const apikey = this.userService.getApikey();

    let observable = new Observable(observer => {

      this.socket = io(ApiConstants.CHAT_ENDPOINT, {
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
        //console.log(data);
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}
