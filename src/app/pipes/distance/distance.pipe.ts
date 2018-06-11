import {Pipe, PipeTransform} from '@angular/core';
import {Event} from "../../models/event";

@Pipe({
    name: 'distance'
})
export class DistancePipe implements PipeTransform {

    static distance(lat1, lon1, lat2, lon2): number {

        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        return dist
    }

    twoDigiRound(distance: number): number {

        return Math.round(distance * 100) / 100;
    }

    transform(event: Event, userCoords: Coordinates): number | string {

        if (!event) {

            return ;
        }
        if (event.distance && event.distance !== -1) {

            // console.log("no need pipe");
            return this.twoDigiRound(event.distance);
        }
        if (userCoords) {

            // console.log("javascript distance");
            return this.twoDigiRound(DistancePipe.distance(event.latitude, event.longitude,
                userCoords.latitude, userCoords.longitude));
        } else {

            // console.log("waiting for refresh");
            return "Unknown";
        }
    }

}
