export class Paginable {

    public data: Array<any>;
    public totalCount: number;
    public page: number;
    public limit: number;
    public totalPages: number;

    constructor(data: Array<any>,
                totalCount: number,
                page: number = 1,
                limit: number = 1) {
        this.data = data;
        this.totalCount = totalCount;
        this.page = page;
        this.limit = limit;
        this.totalPages = Math.ceil(totalCount / limit);
    }

    toString(): string {
        return `${this.page}/${Math.ceil(this.totalPages)}`;
    }
}
