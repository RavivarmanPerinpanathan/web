import {Sport} from "./sport";
import {User} from "./user";
import {Comment} from "./comment";
import {Serialize} from "../interfaces/Serialize";

export class BaseEventCoaching implements Serialize<Sport> {

    public id: number;
    public places: number;
    public name: string;
    public description: string;
    public location: string;
    public date: string;
    public picture: string;
    public sport: Sport;
    public owner: User;
    public registeredUsers: User[];
    public longitude: number;
    public latitude: number;
    public distance: number;

    public registeredFriends: User[];
    public userCount: number;
    public friendCount: number;

    public isRegistered: boolean;
    public noPlaceLimit: boolean;

    public comments: Comment[];
    
    public gotDeleted = false;
    
    constructor(private className: string) {}

    initRegisteredUsersInformations(): void {

        this.userCount = this.registeredUsers.length;
        this.registeredFriends = this.registeredUsers.filter((user) => user.isFriend);
        this.friendCount = this.registeredFriends.length;
    }

    toString(): string {

        return `${this.id}  - ${this.name}`;
    }

    getClassName(): string {

        return this.className;
    }

    deserialize(json: any): BaseEventCoaching {

        this.id = json.id;
        this.places = json.places;
        this.name = json.name;
        this.description = json.description;
        this.location = json.location;
        this.date = json.date;
        this.picture = json.picture;
        this.sport = new Sport().deserialize(json.sport);
        this.owner = new User().deserialize(json.owner);
        this.registeredUsers = [];
        if (json.registered_users) {
            json.registered_users.forEach((userJson: any) => {
                this.registeredUsers.push(new User().deserialize(userJson.user));
            });
        }
        this.longitude = json.longitude;
        this.latitude = json.latitude;
        this.distance = json.distance;

        this.isRegistered = json.isRegistered;
        this.noPlaceLimit = (this.places === 0);

        if (json.comments) {

            this.comments = [];
            json.comments.forEach((commentJson: any) => {
                this.comments.push(new Comment().deserialize(commentJson));
            });
        }

        this.initRegisteredUsersInformations();

        return this;
    }
}
