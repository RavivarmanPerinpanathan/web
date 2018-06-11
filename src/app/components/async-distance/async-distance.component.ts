import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BaseEventCoaching} from "../../models/BaseEventCoaching";
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-async-distance',
    templateUrl: './async-distance.component.html',
    styleUrls: ['./async-distance.component.css']
})
export class AsyncDistanceComponent implements OnInit, OnDestroy {


    @Input() distanceHolder: BaseEventCoaching;
    @Output() onLocationAccessed = new EventEmitter();

    public currentCoords: Coordinates = null;
    private geoLocationSubscription: Subscription;

    constructor(private userService: UserService) {}

    ngOnDestroy(): void {

        if (this.geoLocationSubscription) {

            this.geoLocationSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {

        this.currentCoords = this.userService.getCurrentCoords();
        if (!this.currentCoords) {
            this.geoLocationSubscription = this.userService.coordsSubject
                .subscribe((coords) => {

                    this.onLocationAccessed.emit({coords});
                    this.geoLocationSubscription.unsubscribe();
                    this.currentCoords = coords;
                });
        }
    }
}
