import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {UserService} from "./user.service";
import {BaseEventCoachingService} from "./BaseEventCoaching.service";

import {Coaching} from "../models/coaching";
import {BaseEventCoaching} from "../models/BaseEventCoaching";
import {Observable} from "rxjs/Observable";

@Injectable()
export class CoachingService extends BaseEventCoachingService {

    private formName = "coaching";

    constructor(http: Http, userService: UserService) {

        super(http, userService, "coachings", Coaching);
    }

    post(data: Object): Observable<BaseEventCoaching> {

        return super.post(data, this.formName);
    }

    put(data: Object, coachingId: number): Observable<BaseEventCoaching> {

        return super.put(data, coachingId, this.formName);
    }
}
