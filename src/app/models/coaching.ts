import {BaseEventCoaching} from "./BaseEventCoaching";

export class Coaching extends BaseEventCoaching {

    public price: number;

    constructor() {

        super("Coaching");
    }

    deserialize(json: any): Coaching {

        super.deserialize(json);
        this.price = json.price;

        return this;
    }
}