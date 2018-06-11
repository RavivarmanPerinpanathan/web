/**
 * Created by rael on 27/09/2017.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {UserService} from "./user.service";


import {Event} from "../models/event";
import {ApiConstants} from "../constants/ApiConstants";


@Injectable()
export class CommentService  {


  constructor(private http: Http, private userService: UserService) {

  }

  del(commentId, eventId) {

    const url = `${ApiConstants.API_ENDPOINT}/events/${eventId}/comments/${commentId}`;

    return this.http.delete(url, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });

  }
  del2(commentId, eventId) {

    const url = `${ApiConstants.API_ENDPOINT}/coachings/${eventId}/comments/${commentId}`;

    return this.http.delete(url, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });

  }

  add_comment_event(eventId, comments: string){
    const toSend = {
      'event_comment': {
        'comment': comments
      }
    };
    const url = `${ApiConstants.API_ENDPOINT}/events/${eventId}/comments`;
    return this.http.post(url,toSend, {headers: this.userService.getUserHeaders()})
        .map(response => {
          return response.json();
        });

  }
  add_comment_coaching(eventId, comments: string){
    const toSend = {
      'coaching_comment': {
        'comment': comments
      }
    };
    const url = `${ApiConstants.API_ENDPOINT}/coachings/${eventId}/comments`;
    return this.http.post(url,toSend, {headers: this.userService.getUserHeaders()})
        .map(response => {
          return response.json();
        });

  }

  evaluate_coach(eventId, note: string, comment: string){
    //const toSend = {'evaluate_coach': {'note': note, 'comment': comment}};
    const toSend = {
      'evaluate_coach': {
        'note': note,
        'comment': comment
      }
    };
    const url = `${ApiConstants.API_ENDPOINT}/coachings/${eventId}/evaluations`;
    return this.http.post(url,toSend, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });

  }
  get_eval(userId){
    const url = `${ApiConstants.API_ENDPOINT}/users/${userId}/evaluations`;
    return this.http.get(url,{headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });
  }

}

