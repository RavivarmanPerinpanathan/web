import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "./services/user.service";
import {User} from "./models/user";
import {Subscription} from "rxjs/Subscription";
import {ToasterConfig} from "angular2-toaster";
import {EventService} from "./services/event.service";
import {CoachingService} from "./services/coaching.service";
import {NotifService} from "./services/notification.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    public isLogged: boolean;
    public currentUser: User;
    private logEventSubscription: Subscription;

    public toasterConfig: ToasterConfig =
        new ToasterConfig({
            // animation: 'slideUp'
            // animation: 'fade'
            // animation: 'flyLeft'
            animation: 'flyRight'
            // animation: 'slideDown'
        });

  messages = [];
  connection;
  message;
    msg = [];

    constructor(private userService: UserService
        , private etest: EventService, private ctest: CoachingService, private notifService:NotifService, private router:Router) {
    }

    logout(): void {

        this.userService.logout();
    }

  sendMessage(){
    this.notifService.sendMessage(this.message);
    this.message = '';
  }
    notif() : void {
      console.log(this.messages);
      this.router.navigate(['/profile', this.currentUser]);
    }

    ngOnInit(): void {

        this.isLogged = this.userService.isLogged();
        this.currentUser = this.userService.currentUser;
        this.logEventSubscription = this.userService.onLogEvent
            .subscribe((logValue) => {

                this.isLogged = logValue;
                this.currentUser = this.userService.currentUser;
            });
            console.log("Avant notif");
      this.connection = this.notifService.getMessages().subscribe(message => {
        this.messages.push(message);
        /*for (let i = 0; i < this.messages[i]["message"].length; i++) {
          this.msg[i] = this.messages[i]["message"];
          console.log(this.msg);
        }*/
        console.log(message);
        console.log("Dans notif");
        console.log(this.messages[0]["message"]);
        console.log(message);
      })
    }

    ngOnDestroy(): void {

        this.logEventSubscription.unsubscribe();
    }

}
