import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {ApiConstants} from "../../constants/ApiConstants";
import {Chat} from "../../models/chat";

import * as io from 'socket.io-client';
import {UserService} from "../../services/user.service";
import {ChatMessage} from "../../models/ChatMessage";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {

    chats: Chat[] = [];
    messages = {};
    chatMessages: Chat[] = [];
    chatUserID = 0;
    socket: any = null;
    test = [];

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    @ViewChild('inputMessage') private myMessage: ElementRef;

    constructor(private chatService: ChatService, private userService: UserService) {
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {

        if (this.myScrollContainer) {

            try {
                this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            } catch (err) {
                console.log(err);
            }
        }
    }

    addMessageRealTime = (eventJson: any) => {

        const toPush = new ChatMessage().deserialize(eventJson);

        console.log(toPush);
        console.log(toPush.id);
        // this.messages.push(toPush);
        this.messages[toPush.chat.id].push(toPush);

        //console.log(this.messages);
    };

    ngOnInit(): void {

        const apikey = this.userService.getApikey();
        // console.log(apikey);

        if (!apikey) {

            console.log('Need to be connected to use chat !');
            return ;
        }

        this.getChatList();
        //this.getMessages();
        console.log("i ll send apikey too: " + apikey);
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

        this.socket.emit('message', {msg: 'I just connected from sporthub web'});
        this.socket.on('newChatMessage', this.addMessageRealTime);
        this.socket.on('notification', (notif) => {console.log(notif);});
        this.scrollToBottom();
    }

    ngOnDestroy(): void {
        this.socket.emit('message', {msg: 'Gonna disconnect from sporthub web'});
        console.log("ngOnDestroy: gonna disco from socket");
        this.socket.disconnect();
    }

    getChatList = () => {

        this.chatService.getChats().subscribe((chatList: Chat[]) => {

            this.chats = chatList;

            chatList.forEach((value) => {

                this.messages[value.id] = [];
            });
            //console.log(this.messages);
        }, (error) => console.error(error));
    };

  /*  getMessages = () => {
      console.log("je suis dans getMessage");
        this.chatService.getMessages(62).subscribe((chatList: Chat[]) => {


            this.chatMessages = chatList;

            chatList.forEach((value) => {

                this.messages[value.id] = [];
            });
            console.log(chatList);
            console.log("hello");
        }, (error) => console.error(error));
    };*/


    sendMessage = (inputMessageElement: any, chatId: number) => {

        console.log("je suis dans sendMessage");
        //console.log(chatId);
        if (inputMessageElement.value) {

            this.chatService.postMessage(inputMessageElement.value, chatId)
                .subscribe((chatMessage: ChatMessage) => {
                    //console.log(chatMessage.message);
                    this.chatUserID = chatMessage.author.id;
                });
            inputMessageElement.value = '';
        }
    }
    toto(id){
      this.chatService.getMessages(id).subscribe((chatList: Chat[]) => {
          this.chatMessages = chatList;
          chatList.forEach((value) => {
              this.messages[value.id] = [];
          });
          console.log(this.chatMessages);
          console.log("hello");
      });
      //console.log(chatList);

    }


}
