import {Http, URLSearchParams} from '@angular/http';

import {Paginable} from "../class/Paginable";
import {Observable} from "rxjs/Observable";

import {ApiConstants} from "../constants/ApiConstants";

import "rxjs/add/operator/map";
import {UserService} from "./user.service";

import {BaseEventCoaching} from "../models/BaseEventCoaching";
import {mapDefined} from "tslint/lib/utils";

export class BaseEventCoachingService {

    // private currentList;
    public currentList = [];

    constructor(private http: Http, private userService: UserService,
                private routeName: string, private className) {}

    private addCurrentPosition(toSend: URLSearchParams): URLSearchParams {

        const coords = this.userService.getCurrentCoords();
        if (coords) {

            toSend.set("longitude", coords.longitude.toString());
            toSend.set("latitude", coords.latitude.toString());
        } else if (toSend.get("sortBy") === "distance") {

            toSend.delete("sortBy");
        }
        return toSend;
    }

    public cleanList(): void {

        this.currentList = [];
    }

    private httpParametrize(params: Object): URLSearchParams {

        const toSend = new URLSearchParams();

        Object.keys(params).map(key => {
            if (params[key]) {
                toSend.set(key, params[key]);
            }
        });

        if (toSend.get("longitude") && toSend.get("latitude")) {

            return toSend;
        }
        return this.addCurrentPosition(toSend);
    }

    changeRegistration(changeType: string, resourceId: number): Observable<string> {

        return this.http.get(`${ApiConstants.API_ENDPOINT}/${this.routeName}/${resourceId}/${changeType}`,
            {headers: this.userService.getUserHeaders()})
            .map(response => {

                return response.json();
            });
    }

    register(resourceId: number): Observable<string> {

        return this.changeRegistration("register", resourceId);
    }

    unregister(resourceId: number): Observable<string> {

        return this.changeRegistration("unregister", resourceId);
    }

    factorizeResource(value: any): BaseEventCoaching {

        let tmpIdx = this.currentList.findIndex(x => x.id === value.id);

        if (tmpIdx >= 0) { // object already exist, just need to refresh

            this.currentList[tmpIdx].deserialize(value);
        } else { // need create instance of object

            // array.push returns the new array length, with -1 we get the index of the pushed object
            tmpIdx = this.currentList.push(new this.className().deserialize(value)) - 1;
        }

        return this.currentList[tmpIdx];
    }

    paginableRequest(url: string, params: Object): Observable<Paginable> {

        return this.http.get(url, {params: this.httpParametrize(params), headers: this.userService.getUserHeaders()})
            .map(response => {

                const list = [];

                response.json().forEach((value: any) => {

                    list.push(this.factorizeResource(value));
                });

                return new Paginable(list, parseInt(response.headers.get("totalCount"), 10),
                    params["page"] ? params["page"] : 1,
                    params["limit"] ? params["limit"] : 5);
            });
    }

    gets(params: Object): Observable<Paginable> {

        return this.paginableRequest(`${ApiConstants.API_ENDPOINT}/${this.routeName}`, params);
    }

    getRegistered(params: Object): Observable<Paginable> {

        return this.paginableRequest(`${ApiConstants.API_ENDPOINT}/user/me/${this.routeName}/registered`, params);
    }

    getCreated(params: Object): Observable<Paginable> {

        return this.paginableRequest(`${ApiConstants.API_ENDPOINT}/user/me/${this.routeName}`, params);
    }

    post(data: Object, formName: string): Observable<BaseEventCoaching> {

        const toSend = {};
        toSend[formName] = data;
        const url = `${ApiConstants.API_ENDPOINT}/${this.routeName}`;
        return this.http.post(url, toSend, {headers: this.userService.getUserHeaders()})
            .map(response => {

                return this.factorizeResource(response.json());
            });
    }

    put(data: Object, resourceId: number, formName: string): Observable<BaseEventCoaching> {

        const toSend = {};
        toSend[formName] = data;
        const url = `${ApiConstants.API_ENDPOINT}/${this.routeName}/${resourceId}`;
        return this.http.put(url, toSend, {headers: this.userService.getUserHeaders()})
            .map(response => {

                return this.factorizeResource(response.json());
            });
    }

    get(resourceId: number): Observable<BaseEventCoaching> {

        const url = `${ApiConstants.API_ENDPOINT}/${this.routeName}/${resourceId}`;
        return this.http.get(url, {params: this.httpParametrize({}), headers: this.userService.getUserHeaders()})
            .map(response => {

                return this.factorizeResource(response.json());
            });
    }

    deleteResource(resourceId: number): Observable<string> {

        const url = `${ApiConstants.API_ENDPOINT}/${this.routeName}/${resourceId}`;
        return this.http.delete(url, {headers: this.userService.getUserHeaders()})
            .map(response => {

                return response.json();
            });
    }

}
