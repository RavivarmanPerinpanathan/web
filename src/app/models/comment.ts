import {User} from "./user";
import {Serialize} from "../interfaces/Serialize";

export class Comment implements Serialize<Comment> {

    public id: number;
    public comment: string;
    public created_at: string;
    public author: User;

    toString(): string {

        return `${this.id}  - ${this.author.username}: ${this.comment} (${this.created_at})`;
    }

    deserialize(json: any): Comment {

        this.id = json.id;
        this.comment = json.comment ;
        this.created_at = json.created_at;
        this.author = new User().deserialize(json.author);

        return this;
    }
}
