export class MessageDto {
    readonly topic: string;
    readonly message: object;

    constructor(topic: string, message: object) {
        this.topic = topic;
        this.message = message;
    }
}