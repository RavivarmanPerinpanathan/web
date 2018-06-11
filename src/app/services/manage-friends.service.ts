/**
 * Created by rael on 26/10/2017.
 */
import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';

import {Paginable} from "../class/Paginable";
import {Observable} from "rxjs/Observable";

import {ApiConstants} from "../constants/ApiConstants";

import "rxjs/add/operator/map";
import {UserService} from "./user.service";


@Injectable()
export class ManageFriendsService  {



  constructor(private http: Http, private userService: UserService) {

  }

  requestfriend(friendId) {
    //const url = `${ApiConstants.API_ENDPOINT}/user/me/${friendId}/request`;
      const url = `http://163.5.84.210/api/user/me/${friendId}/request`;
    return this.http.get(url, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });

  }
  accept_friend_request(friendId) {

    //const url = `${ApiConstants.API_ENDPOINT}/user/me/accept/request/${friendId}`;
      const url = `http://163.5.84.210/api/user/me/accept/request/${friendId}`;
    return this.http.get(url, {headers: this.userService.getUserHeaders()})
        .map(response => {
          return response.json();
        });

  }
  reject_friend_request(friendId) {

    //const url = `${ApiConstants.API_ENDPOINT}/user/me/reject/request/{friendId}`;
      const url = `http://163.5.84.210/api/user/me/reject/request/{friendId}`;
    return this.http.get(url, {headers: this.userService.getUserHeaders()})
        .map(response => {
          return response.json();
        });

  }

  remove_friend(friendId) {

    //const url = `${ApiConstants.API_ENDPOINT}/user/me/${friendId}/remove`;
      const url = `http://163.5.84.210/api/user/me/${friendId}/remove`;
    return this.http.get(url, {headers: this.userService.getUserHeaders()})
        .map(response => {
          return response.json();
        });

  }
    pending_friends_request(){

        //const url = `${ApiConstants.API_ENDPOINT}/user/me/friendrequests`;
        const url = `http://163.5.84.210/api/user/me/friendrequests`;
        return this.http.get(url, {headers: this.userService.getUserHeaders()})
            .map(response =>  response.json()
            );
    }

  displayfriends(userId){
    const url = `${ApiConstants.API_ENDPOINT}/users/${userId}/friends`;
    return this.http.get(url, {headers: this.userService.getUserHeaders()})
      .map(response =>response.json()
      );
  }

}
