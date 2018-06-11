import {Serialize} from "../interfaces/Serialize";
import {User} from "./user";

export class Chat implements Serialize<Chat> {

    public id: number;
    public name: string;
    public users: User[];

    public toString() {

        return this.id + ' - ' + this.name;
    }

    deserialize(json: any): Chat {

        this.id = json.id;
        this.name = json.name;
        this.users = [];
        if (json.users) {
            json.users.forEach((userJson: any) => {
                this.users.push(new User().deserialize(userJson));
            });
        }

        return this;
    }
}