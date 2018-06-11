import {Component, OnDestroy, OnInit} from '@angular/core';
import {MdDialog} from "@angular/material";

import {EventService} from "../../services/event.service";

import {Paginable} from "../../class/Paginable";

import {SportService} from "../../services/sport.service";
import {Sport} from "../../models/sport";
import {CoachingService} from "../../services/coaching.service";
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs/Subscription";
import {BaseEventCoaching} from "../../models/BaseEventCoaching";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

    currentPage: number;
    totalPages: number;
    itemLimit = 6;
    list: BaseEventCoaching[];
    sports: Sport[];
    searchParameters: any = {};
    sortByList = ["date", "distance"];
    sortDirectionList = ["asc", "desc"];

    private geoLocationSubscription: Subscription;

    private serviceList = {
        "Events": this.eventService,
        "Coachings": this.coachingService
    };
    public currentResource = "Events";

    canSearchByDistance = false;

    private searchSubscription: Subscription;

    constructor(private eventService: EventService, private coachingService: CoachingService, private dialog: MdDialog,
                private userService: UserService, private sportService: SportService) {}

    cleanFactories(): void {


        this.eventService.cleanList();
        this.coachingService.cleanList();
    }

    onSelectChange = (resourceName: string): void => {

        this.currentResource = resourceName;
        this.searchParameters = {};
        this.getList(1, true);
    };

    ngOnDestroy() {

        this.cleanFactories();
        if (this.geoLocationSubscription) {

            this.geoLocationSubscription.unsubscribe();
        }
    }

    ngOnInit() {

        this.cleanFactories();

        if (this.userService.getCurrentCoords()) {

            this.canSearchByDistance = true;
        } else {

            this.geoLocationSubscription = this.userService.coordsSubject
                .subscribe(() => {

                    this.geoLocationSubscription.unsubscribe();
                    this.canSearchByDistance = true;
                });
        }

        this.getList(1, true);
        this.getSports();
    }

    getFormatedDate(date: Date): string {

        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }

    formatDates(): void {

        if (this.searchParameters.beforeDate) {

            this.searchParameters.beforeDate = this.getFormatedDate(new Date(this.searchParameters.beforeDate));
        }
        if (this.searchParameters.afterDate) {

            this.searchParameters.afterDate = this.getFormatedDate(new Date(this.searchParameters.afterDate));
        }
    }

    getList = (page: number = 1, overwrite: boolean = false) => {

        if (page === this.currentPage && !overwrite) {
            return;
        }
        this.searchParameters.page = page;
        this.searchParameters.limit = this.itemLimit;
        this.formatDates();
        console.log(this.searchParameters);
        if (this.searchSubscription) {

            this.searchSubscription.unsubscribe();
        }
        this.searchSubscription = this.serviceList[this.currentResource].gets(this.searchParameters)
            .subscribe((pagination: Paginable) => {

                this.list = pagination.data;
                this.currentPage = page;
                this.totalPages = pagination.totalPages;
                console.log(this.currentResource);
                console.log(this.searchParameters);
                console.log(pagination);

                console.log(pagination.toString());
            }, (error) => console.error(error));
    };

    getSports = () => {

        this.sportService.getSports()
            .subscribe((sports: Sport[]) => {

                this.sports = sports;
            }, (error) => console.error(error));
    };
}
