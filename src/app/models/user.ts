import {Sport} from "./sport";
import {Serialize} from "../interfaces/Serialize";

export class User implements Serialize<User> {

    public id: number;
    public username: string;
    public email: string;
    public picture: string;
    public favorite_sports: Array<Sport> = [];
    public isFriend: boolean;

    toString(): string {

        return `${this.id}  - ${this.username}`;
    }

    deserialize(json: any): User {

        this.id = json.id;
        this.username = json.username;
        this.email = json.email;
        this.picture = json.picture;
        if (json.favorite_sports) {
            json.favorite_sports.forEach((sportJson: any) => {
                this.favorite_sports.push(new Sport().deserialize(sportJson));
            });
        }
        this.isFriend = json.isFriend;

        return this;
    }
}
