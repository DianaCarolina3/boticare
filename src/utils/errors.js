export class Errors extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}
//# sourceMappingURL=errors.js.map