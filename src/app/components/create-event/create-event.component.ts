import {Component, Inject, OnInit} from '@angular/core';
import {Sport} from "../../models/sport";
import {SportService} from "../../services/sport.service";
import {EventService} from "../../services/event.service";
import {BaseEventCoaching} from "../../models/BaseEventCoaching";
import {ToasterService} from "angular2-toaster";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {CoachingService} from "../../services/coaching.service";
import {Coaching} from "../../models/coaching";
import {Event} from "../../models/event";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'app-create-event',
    templateUrl: './create-event.component.html',
    styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

    maxDate: Date;
    toSend: any = {};
    tmpDate: Date;
    sports: Sport[];
    editMode: boolean;
    startingLocation: any;
    isFree: boolean;
    noPlaceLimit: boolean;

    private serviceList = {
        "Event": this.eventService,
        "Coaching": this.coachingService
    };
    eventType: string;

    constructor(private eventService: EventService, private coachingService: CoachingService,
                private sportService: SportService, private toaster: ToasterService,
                private dialogRef: MdDialogRef<CreateEventComponent>, @Inject(MD_DIALOG_DATA) public data: BaseEventCoaching) {}

    ngOnInit() {

        if (this.data) {

            this.editMode = true;
            this.initType(this.data.getClassName());
        } else {

            this.editMode = false;
        }
        this.getSports();
        this.maxDate = new Date();
        this.maxDate.setDate(this.maxDate.getDate() - 1);
    }

    initType(type) {

        this.eventType = type;
        this.toSend = {
            sport: null,
            picture: null,
            name: null,
            description: null,
            location: null,
            date: null,
            places: null,
            longitude: null,
            latitude: null
        };
        if (type === "Coaching") {

            this.toSend.price = null;
        }
        if (this.data) {

            this.startingLocation = {
                location: this.data.location,
                longitude: this.data.longitude,
                latitude: this.data.latitude
            };

            const specialKeys = {
                "sport": (value) => value.id,
                "date": (value) => {

                    this.tmpDate = new Date(value);
                },
                "picture": () => null,
                "places": (value) => {

                    if (value) {

                        this.noPlaceLimit = false;
                        return value;
                    } else {

                        this.noPlaceLimit = true;
                        return 0;
                    }
                },
                "price": (value) => {

                    if (value) {

                        this.isFree = false;
                        return value;
                    } else {

                        this.isFree = true;
                        return 0;
                    }
                }
            };

            for (const k in this.toSend) {

                if (this.toSend.hasOwnProperty(k)) {

                    if (specialKeys[k]) {

                        this.toSend[k] = specialKeys[k](this.data[k]);
                    } else {

                        this.toSend[k] = this.data[k];
                    }
                }

            }
        }
    }

    getSports = () => {

        this.sportService.getSports()
            .subscribe((sports: Sport[]) => {

                this.sports = sports;
            }, (error) => console.error(error));
    };

    locationSelected = (location) => {

        console.log(location);
        this.toSend.location = location.address;
        this.toSend.longitude = location.longitude;
        this.toSend.latitude = location.latitude;
    };

    checkRequirements() {

        for (const k in this.toSend) {

            if (this.toSend.hasOwnProperty(k) && !this.toSend[k] && this.toSend[k] !== 0 && k !== "picture") {

                console.log(k);
                return false;
            }
        }
        return true;
    }

    arrangeData() {

        this.toSend.date = this.getFormatedDate(this.tmpDate);
        if (this.noPlaceLimit) {

            this.toSend.places = 0;
        }
        if (this.eventType === "Coaching" && this.isFree) {

            this.toSend.price = 0;
        }
    }

    sendDifferencesOnly() {

        const editedValues = {};
        const specialKeys = {
            "date": (newValue, oldValue) => new Date(newValue).getTime() !== new Date(oldValue).getTime(),
            "picture": (newValue) => newValue != null,
            "sport": (newValue, oldValue) => newValue !== oldValue.id,
        };
        for (const k in this.toSend) {

            if (this.toSend.hasOwnProperty(k)) {

                if (specialKeys[k]) {

                    if (specialKeys[k](this.toSend[k], this.data[k])) {

                        editedValues[k] = this.toSend[k];
                    }
                } else if (this.toSend[k] !== this.data[k]) {

                    editedValues[k] = this.toSend[k];
                }
            }
        }
        return editedValues;
    }

    apiRequest(apiService: EventService | CoachingService): Observable<BaseEventCoaching> {

        if (this.editMode) {

            // return apiService.put(this.sendDifferencesOnly(), this.data.id);
            const tmp = this.sendDifferencesOnly();
            console.log(tmp);
            return apiService.put(tmp, this.data.id);
        }
        console.log(this.toSend);
        return apiService.post(this.toSend);
    }

    post = () => {

        if (!this.eventType) {

            console.error("Event Type not selected");
            return ;
        }

        this.arrangeData();

        if (!this.checkRequirements()) {

            this.toaster.pop("error", "Please fill everything");
            return ;
        }

        const successMsg = this.eventType + " successfully " + (this.editMode ? "edited" : "created");
        const errorMsg =  "Failed to " + (this.editMode ? "edit" : "create") + " your " + this.eventType;
        this.apiRequest(this.serviceList[this.eventType])
            .subscribe((createdEvent: BaseEventCoaching) => {

                this.toaster.pop("success", successMsg);
                this.dialogRef.close(createdEvent);
            }, (error) => {

                console.log(error);
                this.toaster.pop("error", errorMsg);
            });
    };

    getFormatedDate(date: Date): string {

        if (!date || typeof date === "string") {

            return null;
        }
        return date.getFullYear() + '-' + this.getDoubleDigit((date.getMonth() + 1)) + '-' + this.getDoubleDigit(date.getDate())
            + " " + this.getDoubleDigit(date.getHours()) + ":" + this.getDoubleDigit(date.getMinutes());
    }

    getDoubleDigit(number: number): string {

        return number > 9 ? "" + number : "0" + number;
    }
}
