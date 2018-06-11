import {User} from "./user";
import {Serialize} from "../interfaces/Serialize";
import {Chat} from "./chat";

export class ChatMessage implements Serialize<ChatMessage> {

    public id: number;
    public author: User;
    public chat: Chat;
    public message: string;
    public created_at: Date;
    public updated_at: Date;

    toString(): string {

        return `${this.author.username}:
         ${this.message} (${this.created_at.toLocaleString()})`;
    }

    deserialize(json: any): ChatMessage {

        this.id = json.id;
        this.message = json.message;
        this.created_at = new Date(json.created_at);
        this.updated_at = new Date(json.updated_at);
        this.author = new User().deserialize(json.author);
        this.chat = new Chat().deserialize(json.chat);

        return this;
    }
}
