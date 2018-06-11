import {Component, Input, OnInit} from '@angular/core';
import {MdDialog} from "@angular/material";
import {EventDetailComponent} from "../event-detail/event-detail.component";
import {BaseEventCoaching} from "../../models/BaseEventCoaching";
import {CoachingService} from "../../services/coaching.service";
import {EventService} from "../../services/event.service";
import {ToasterService} from "angular2-toaster";
import {Observable} from "rxjs/Observable";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {

  @Input() event: BaseEventCoaching;
  userLogged: boolean;

  private serviceList = {
    "Event": this.eventService,
    "Coaching": this.coachingService
  };

  constructor(private dialog: MdDialog, private toaster: ToasterService, private userService: UserService,
              private eventService: EventService, private coachingService: CoachingService) {}

  ngOnInit() {

    this.userLogged = this.userService.isLogged();
  }

  openEventDetail(event: BaseEventCoaching): void {

    this.dialog.open(EventDetailComponent, { data: event });
  }

  handleRegistrationChange(observable: Observable<string>, event: BaseEventCoaching): void {

    observable
        .map((response) => {

          this.serviceList[event.getClassName()].get(event.id).subscribe();
          return response;
        })
        .subscribe((textMessage: string) => {

          console.log(textMessage);
          this.toaster.pop("success", textMessage);
        }, error => {

          this.toaster.pop("error", error.json().message);
        });
  }

  register(event: BaseEventCoaching): void {

    this.handleRegistrationChange(this.serviceList[event.getClassName()].register(event.id), event);
  }

  unregister(event: BaseEventCoaching): void {

    this.handleRegistrationChange(this.serviceList[event.getClassName()].unregister(event.id), event);
  }
}
