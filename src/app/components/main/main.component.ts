import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventService} from "../../services/event.service";
import {Paginable} from "../../class/Paginable";
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs/Subscription";
import {CoachingService} from "../../services/coaching.service";
import {Coaching} from "../../models/coaching";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

    listWithFriends: Event[] | Coaching[];
    favoriteSportsList: Event[] | Coaching[];
    upcomingList: Event[] | Coaching[];
    nearList: Event[] | Coaching[];
    showNearList = false;
    userLogged: boolean;
    private geoLocationSubscription: Subscription;

    private serviceList = {
        "Events": this.eventService,
        "Coachings": this.coachingService
    };
    public currentResource = "Events";

    private nearSubscription: Subscription;
    private upcomingSubscription: Subscription;
    private favoriteSportsSubscription: Subscription;
    private withFriendSubscription: Subscription;

    constructor(private eventService: EventService, private userService: UserService,
                private coachingService: CoachingService) {}


    cleanFactories(): void {


        this.eventService.cleanList();
        this.coachingService.cleanList();
    }

    onSelectChange = (resourceName: string): void => {

        this.currentResource = resourceName;
        this.ngOnInit();
    };

    ngOnDestroy(): void {

        this.cleanFactories();

        if (this.geoLocationSubscription) {

            this.geoLocationSubscription.unsubscribe();
        }
        if (this.nearSubscription) {

            this.nearSubscription.unsubscribe();
        }
        if (this.favoriteSportsSubscription) {

            this.favoriteSportsSubscription.unsubscribe();
        }
        if (this.withFriendSubscription) {

            this.withFriendSubscription.unsubscribe();
        }
        if (this.upcomingSubscription) {

            this.upcomingSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {


        this.userLogged = this.userService.isLogged();
        if (this.userLogged) {

            this.getListWithFriends();
            this.getFavoriteSportsList();
        }

        this.getUpcomingList();

        if (this.userService.getCurrentCoords()) {

            this.showNearList = true;
            this.getNearList();
        } else {

            this.geoLocationSubscription = this.userService.coordsSubject
                .subscribe(() => {

                    this.geoLocationSubscription.unsubscribe();
                    this.showNearList = true;
                    this.getNearList();
                });
        }
    }

    getNearList = (page: number = 1, limit: number = 4) => {

        if (this.nearSubscription) {

            this.nearSubscription.unsubscribe();
        }
        this.nearSubscription = this.serviceList[this.currentResource].gets({
            page: page,
            limit: limit,
            sortBy: "distance",
            afterDate: new Date().toISOString()
        }).subscribe((pagination: Paginable) => {

            this.nearList = pagination.data;
        }, (error) => console.error(error));
    };

    getUpcomingList = (page: number = 1, limit: number = 4) => {

        if (this.upcomingSubscription) {

            this.upcomingSubscription.unsubscribe();
        }
        this.upcomingSubscription = this.serviceList[this.currentResource].gets({
            page: page,
            limit: limit,
            sortBy: "date",
            afterDate: new Date().toISOString()
        }).subscribe((pagination: Paginable) => {

            this.upcomingList = pagination.data;
        }, (error) => console.error(error));
    };

    getListWithFriends = (page: number = 1, limit: number = 4) => {

        if (this.withFriendSubscription) {

            this.withFriendSubscription.unsubscribe();
        }
        this.withFriendSubscription = this.serviceList[this.currentResource].gets({
            page: page,
            limit: limit,
            sortBy: "distance",
            afterDate: new Date().toISOString(),
            withFriends: true
        }).subscribe((pagination: Paginable) => {

            this.listWithFriends = pagination.data;
        }, (error) => console.error(error));
    };

    getFavoriteSportsList = (page: number = 1, limit: number = 4) => {

        if (this.favoriteSportsSubscription) {

            this.favoriteSportsSubscription.unsubscribe();
        }
        this.favoriteSportsSubscription = this.serviceList[this.currentResource].gets({
            page: page,
            limit: limit,
            sortBy: "distance",
            afterDate: new Date().toISOString(),
            favoriteSports: true
        }).subscribe((pagination: Paginable) => {

            this.favoriteSportsList = pagination.data;
        }, (error) => console.error(error));
    };
}
