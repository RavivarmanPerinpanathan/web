import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Sport} from "../models/sport";
import {ApiConstants} from "../constants/ApiConstants";

@Injectable()
export class SportService {

    constructor(private http: Http) {}


    getSports(): Observable<Sport[]> {

        const url = `${ApiConstants.API_ENDPOINT}/sports`;
        return this.http.get(url)
            .map(response => {

                const sportList: Sport[] = [];

                response.json().forEach(function (value: Object) {
                    sportList.push(new Sport().deserialize(value));
                });
                return sportList;
            })
    }
}
