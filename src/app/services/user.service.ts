import {Injectable, Injector} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {Router} from "@angular/router";

import {ApiConstants} from "../constants/ApiConstants";

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import {User} from "../models/user";
import {Subject} from "rxjs/Subject";
import {ToasterService} from "angular2-toaster";


@Injectable()
export class UserService {

    private router: Router;
    private headers: Headers = new Headers();
    public currentUser: User = null;
    public onLogEvent: Subject<boolean> = new Subject<boolean>(); // true => login - false => logout
    public currentCoords: Coordinates = null;
    public coordsSubject: Subject<Coordinates> = new Subject<Coordinates>();


    constructor(private http: Http, private injector: Injector, private toaster: ToasterService) {
    }

    public initApp(): Promise<boolean> {

        this.retrieveCoords();
        return this.getLastUser();
    }

    private retrieveCoords(): void {

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(position => {

                this.currentCoords = position.coords;
                this.coordsSubject.next(position.coords);
            }, error => {

                console.log(error);
                this.toaster.pop("info", "A lot of SportHub's features need access" +
                    " to your geo-location, we highly recommend you to enable it.");
            });
        } else {

            this.toaster.pop("info", "Your browser does not support geo-location, some features will be disabled");
        }
    }

    private getLastUser(): Promise<boolean> {

        this.router = this.injector.get(Router);

        const savedApikey = localStorage.getItem("sporthubUserApikey");
        if (savedApikey) {

            return this.getUserData(savedApikey).toPromise();
        }
    }

    private setApikey(apikey: string): void {

        this.headers.set("apikey", apikey);
        localStorage.setItem("sporthubUserApikey", apikey);
    }

    public getApikey(): string {

        return this.headers.get("apikey");
    }

    private removeApikey(): void {

        this.headers.delete("apikey");
        localStorage.removeItem("sporthubUserApikey");
    }

    public getUserHeaders(): Headers {

        return this.headers;
    }

    public getCurrentCoords(): Coordinates {

        return this.currentCoords;
    }

    public isLogged(): boolean {

        return (this.currentUser != null);
    }

    public logout(): void {

        this.removeApikey();
        this.currentUser = null;
        this.onLogEvent.next(false);
        this.router.navigate(['/']);
    }

    public getUser(id: string): Observable<any> {

        const route = (id === "me" ? "user" : "users");
        return this.http.get(`${ApiConstants.API_ENDPOINT}/${route}/${id}`, {headers: this.headers})
            .map(response => response.json());
    }

    public getUserData(apikey: string): Observable<boolean> {

        this.setApikey(apikey);
        return this.getUser("me")
            .map(userData => {

                this.currentUser = new User().deserialize(userData);
                this.onLogEvent.next(true);
                return true;
            })
            .catch((error) => {

                this.removeApikey();
                return Observable.throw(error || 'Server error');
            });
    }

    sporthubLogin(credentials: Object): Observable<boolean> {

        return this.loginFlow(this.http.post(`${ApiConstants.URL}/ajaxLogin`, credentials));
    }

    facebookLogin(credentials: Object): Observable<boolean> {

        return this.loginFlow(this.http.post(`${ApiConstants.URL}/ajaxOauthLogin`, credentials));
    }

    loginFlow = (loginObservable: Observable<any>): Observable<boolean> => {

        return loginObservable
            .map((response: any) => {

                return response.json().apikey;
            })
            .flatMap((apikey: string) => {

                return this.getUserData(apikey);
            });
    };

    signup(credentials: Object): Observable<any> {

        return this.http.post(`${ApiConstants.URL}/ajaxRegister`, credentials)
            .map((response: any) => {

                return response.json();
            });
    }

    confirmEmail(credentials: Object): Observable<any> {

        return this.http.post(`${ApiConstants.URL}/ajaxConfirmEmail`, credentials)
            .map((response: any) => {

                return response.json();
            });
    }

    put(data: Object): Observable<User> {

        const toSend = {
            user: data
        };
        const url = `${ApiConstants.API_ENDPOINT}/user/me`;
        return this.http.put(url, toSend, {headers: this.getUserHeaders()})
            .map(response => {

                return new User().deserialize(response.json())
            });
    }

    requestResetPasswd(username){
      return this.http.get(`${ApiConstants.URL}/ajaxResetPassword/${username}`)
        .map((response: any) => {
          return response.json();
        });

    }
    resetPasswd(token, password1, password2){
      const toSend = {
        'fos_user_resetting': {
          'plainPassword':{
            'first': password1,
            'second': password2
          }
        }
      };
     /* 'first': password1,
        'second': password2*/
      const url = `${ApiConstants.URL}/ajaxResetPassword/${token}`;
      return this.http.post(url,toSend)
        .map((response: any) => {
          return response.json();
        });
    }

  changePasswd(currentpwd, newpwd1, newpwd2){
    const toSend = {
      'fos_user_change_password': {
      'current_password': currentpwd,
        'plainPassword':{
          'first': newpwd1,
          'second': newpwd2
        }
      }
    };
    const url = `${ApiConstants.API_ENDPOINT}/user/me/changePassword`;
    return this.http.post(url, toSend, {headers: this.getUserHeaders()})
      .map((response: any) => {
        return response.json();
      });
  }

}
