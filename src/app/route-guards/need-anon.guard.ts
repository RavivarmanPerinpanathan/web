import { Injectable } from '@angular/core';
import {CanActivate} from "@angular/router";

import {UserService} from "../services/user.service";
import {ToasterService} from "angular2-toaster";

@Injectable()
export class NeedAnonGuard implements CanActivate {

    constructor(private userService: UserService, private toaster: ToasterService) { }

    canActivate() {

        if (this.userService.isLogged()) {

            this.toaster.pop("info", "You are already logged in.");
            return false;
        }
        return true;
    }

}
