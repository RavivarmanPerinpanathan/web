import {Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {UserService} from "../../services/user.service";
import {MapsAPILoader} from "@agm/core";

import {} from '@types/googlemaps';
import {Event} from "../../models/event";
import {Coaching} from "../../models/coaching";
import {Paginable} from "../../class/Paginable";
import {EventService} from "../../services/event.service";

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

    latitude: number;
    longitude: number;
    nearList: Event[] | Coaching[];

    @ViewChild("locationSearch")
    public locationSearch: ElementRef;

    private geocoder: google.maps.Geocoder;

    @Output() locationSelected = new EventEmitter();

    @Input() startingLocation: any;

    constructor(private userService: UserService, private eventService: EventService,
                private mapsAPI: MapsAPILoader, private ngZone: NgZone) {}

    ngOnInit() {

        if (this.startingLocation) {

            this.locationSearch.nativeElement.value = this.startingLocation.location;
            this.latitude = this.startingLocation.latitude;
            this.longitude = this.startingLocation.longitude;
        } else {

            const currentCoords = this.userService.getCurrentCoords();
            if (currentCoords) {

                this.latitude = currentCoords.latitude;
                this.longitude = currentCoords.longitude;
                this.getNearList(); // TODO testonly Useless: remove this
            }
        }
        this.initLocationSearch();
    }

    emitSelectedLocation = () => {

        this.locationSelected.emit({
            address: this.locationSearch.nativeElement.value,
            longitude: this.longitude,
            latitude: this.latitude
        });
    };

    getNearList = (page: number = 1, limit: number = 4) => {

        this.eventService.gets({
            page: page,
            limit: limit,
            longitude: this.longitude,
            latitude: this.latitude,
            sortBy: "distance",
            afterDate: new Date().toISOString()
        }).subscribe((pagination: Paginable) => {

            this.nearList = pagination.data;
        }, (error) => console.error(error));
    };

    mapClicked(clickEvent): void {

        if (this.geocoder) {

            this.latitude = clickEvent.coords.lat;
            this.longitude = clickEvent.coords.lng;
            this.geocoder.geocode({
                'location': new google.maps.LatLng(clickEvent.coords.lat, clickEvent.coords.lng)
            }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results[0]) {

                    // console.log(results);
                    this.locationSearch.nativeElement.value = results[0].formatted_address;
                    this.emitSelectedLocation();
                }
            });
        } else {

            console.error("geocoder not ready yet");
        }
    }

    initLocationSearch(): void {

        // load Places Autocomplete
        this.mapsAPI.load().then(() => {

            // from lat|long to address
            this.geocoder = new google.maps.Geocoder();

            // from address to long|lat
            const autocomplete = new google.maps.places.Autocomplete(this.locationSearch.nativeElement, {
                types: ["address"]
            });
            autocomplete.addListener("place_changed", () => {

                this.ngZone.run(() => {

                    console.log("ngzone");

                    // get the place result
                    const place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    // verify result
                    if (place.geometry === undefined || place.geometry === null) {

                        console.log("no good");
                        return;
                    }

                    // set latitude, longitude and zoom
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();

                    this.emitSelectedLocation();
                });
            });
        });
    }
}
