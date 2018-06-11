/**
 * Created by rael on 08/12/2017.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {UserService} from "./user.service";


import {Event} from "../models/event";
import {ApiConstants} from "../constants/ApiConstants";


@Injectable()
export class RentsService  {


  constructor(private http: Http, private userService: UserService) {

  }

  createrents(/*pic, name, note, price, quantity*/data: Object){
    const toSend = {
      rent: data
    };
    /*const toSend = {
      'rent': {
        'thumbnail': pic,
        'name': name,
        'note': note,
        'price': price,
        'quantity': quantity
      }
    };*/
    const url = `${ApiConstants.API_ENDPOINT}/rents`;
    return this.http.post(url,toSend, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });
  }

  editrents(data: Object, id){
    const toSend = {
      rent: data
    };

    const url = `${ApiConstants.API_ENDPOINT}/rents/${id}`;
    return this.http.put(url,toSend, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });
  }

  get_a_rent(rentid){
    const url = `${ApiConstants.API_ENDPOINT}/rents/${rentid}`;
    return this.http.get(url, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });
  }
  getallrents(){
    const url = `${ApiConstants.API_ENDPOINT}/rents`;
    return this.http.get(url, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });
  }
  getMyrents(){
    const url = `${ApiConstants.API_ENDPOINT}/user/me/rents`;
    return this.http.get(url, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });
  }
  getRentableItemsListtoEvent(id){
    const url = `${ApiConstants.API_ENDPOINT}/events/${id}`;
    return this.http.get(url, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });
  }

  deleterent(rentsid){
    const url = `${ApiConstants.API_ENDPOINT}/rents/${rentsid}`;
    return this.http.delete(url, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });
  }

  add_rent_toEvent(eventId,rentId){
    const url = `${ApiConstants.API_ENDPOINT}/events/${eventId}/rents/${rentId}/register`;
    return this.http.get(url, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });
  }

  rent_Items(eventRentId){
    const url = `${ApiConstants.API_ENDPOINT}/user/me/rent/${eventRentId}`;
    return this.http.get(url, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });
  }
  unrent_Items(userRent){
    const url = `${ApiConstants.API_ENDPOINT}/user/me/unrent/${userRent}`;
    return this.http.get(url, {headers: this.userService.getUserHeaders()})
      .map(response => {
        return response.json();
      });
  }

}
