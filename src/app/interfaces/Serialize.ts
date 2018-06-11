export interface Serialize<T> {
    deserialize(input: Object): T;
}