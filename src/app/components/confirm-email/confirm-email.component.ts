import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ToasterService} from "angular2-toaster";
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-confirm-email',
    templateUrl: './confirm-email.component.html',
    styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {

    private sub: Subscription;
    message: string;

    constructor(private route: ActivatedRoute, private userService: UserService, private toaster: ToasterService) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {

            console.log(params);
            this.userService.confirmEmail({
                token: params.token
            }).subscribe((response) => {

                this.message = response.message;
                this.toaster.pop("success", response.message);
            }, (error) => {

                this.message = error.json().message;
                this.toaster.pop("error", error.json().message);
            });
        });
    }

    ngOnDestroy() {

        this.sub.unsubscribe();
    }
}
