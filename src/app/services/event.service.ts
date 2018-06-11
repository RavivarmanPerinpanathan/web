import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {UserService} from "./user.service";
import {BaseEventCoachingService} from "./BaseEventCoaching.service";

import {Event} from "../models/event";
import {BaseEventCoaching} from "../models/BaseEventCoaching";
import {Observable} from "rxjs/Observable";

@Injectable()
export class EventService extends BaseEventCoachingService {

    private formName = "event";

    constructor(http: Http, userService: UserService) {

        super(http, userService, "events", Event);
    }

    post(data: Object): Observable<BaseEventCoaching> {

        return super.post(data, this.formName);
    }

    put(data: Object, eventId: number): Observable<BaseEventCoaching> {

        return super.put(data, eventId, this.formName);
    }
}
