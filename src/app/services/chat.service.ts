import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Sport} from "../models/sport";
import {ApiConstants} from "../constants/ApiConstants";
import {Chat} from "../models/chat";
import {ChatMessage} from "../models/ChatMessage";
import {UserService} from "./user.service";

@Injectable()
export class ChatService {

    constructor(private http: Http, private userService: UserService) {}

    getChats(): Observable<Sport[]> {

        const url = `${ApiConstants.API_ENDPOINT}/chats`;
        return this.http.get(url, {headers: this.userService.getUserHeaders()})
            .map(response => {

                const chatList: Chat[] = [];

                response.json().forEach(function (value: Object) {
                    chatList.push(new Chat().deserialize(value));
                });
                return chatList;
            })
    }

    getMessages(chatId: number): Observable<Sport[]> {

        const url = `${ApiConstants.API_ENDPOINT}/chats/${chatId}/message`;
        return this.http.get(url, {headers: this.userService.getUserHeaders()})
            .map(response => {

                const chatList: Chat[] = [];

                response.json().forEach(function (value: Object) {
                    chatList.push(new Chat().deserialize(value));
                });
                console.log(chatList);
                return chatList;
            })
    }

    postMessage(message: string, chatId: number): Observable<ChatMessage> {

        const toSend = {
            'chat_message': {
                'message': message
            }
        };
        const url = `${ApiConstants.API_ENDPOINT}/chats/${chatId}/message`;
        return this.http.post(url, toSend, {headers: this.userService.getUserHeaders()})
            .map(response => {

                return new ChatMessage().deserialize(response.json());
            });
    }

}
