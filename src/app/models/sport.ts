import {Serialize} from "../interfaces/Serialize";

export class Sport implements Serialize<Sport> {

    public id: number;
    public name: string;

    public toString() {

        return this.id + ' - ' + this.name;
    }

    deserialize(json: any): Sport {

        this.id = json.id;
        this.name = json.name;

        return this;
    }
}