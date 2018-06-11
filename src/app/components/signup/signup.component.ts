import { Component, OnInit } from '@angular/core';
import {ToasterService} from "angular2-toaster";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


    email: string;
    username: string;
    password1: string;
    password2: string;
    loading = false;
    successMessage: string;

    constructor(private userService: UserService, private toaster: ToasterService) { }

    ngOnInit() {
    }

    signup = () => {

        this.loading = true;
        this.userService.signup({
            fos_user_registration: {
                email: this.email,
                username: this.username,
                plainPassword: {
                    first: this.password1,
                    second: this.password2
                }
            }
        }).subscribe((response) => {

            this.loading = false;
            this.successMessage = response.message;
        }, (error) => {

            console.log(error);
            this.toaster.pop("error", error.json().message);
            this.loading = false;
        });
    };

}
