import { IsNumber } from "class-validator";
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, ObjectLiteral } from "typeorm";
import { ObjectType } from "../types/collection.type";

export class PaginationMeta {
    
    @IsNumber({allowNaN: false})
    total: number;
    
    @IsNumber({allowNaN: false})
    page_size: number;
    
    @IsNumber({allowNaN: false})
    current_page: number;
    
    @IsNumber({allowNaN: false})
    last_page: number;
    
    @IsNumber({allowNaN: false})
    from: number;
    
    @IsNumber({allowNaN: false})
    to: number;

    constructor(count: number, page: number = 1, pageSize: number = 10) {
        if(pageSize < 1) {
            throw new Error("Page size must be greater than 1")
        }

        if(page < 1) {
            throw new Error("Current Page must be greater than or equals to 1")
        }

        this.from = (page - 1) * pageSize
        this.to = page * pageSize
        this.total =  count
        this.current_page = page
        this.last_page = Math.ceil(count / pageSize)
        this.page_size = pageSize
    }
}

export class PaginatedFindParams<T extends ObjectLiteral> {

    constructor(
        public page = 1,
        public pageSize = 10,
        private filters?: Array<FindOptionsWhere<T>>,
        private sorts?: FindOptionsOrder<T>
    ) {}

    toFindOption(): FindManyOptions<T> {
        const options: FindManyOptions<T> = {
            skip: (this.page - 1) * this.pageSize,
            take: this.page * this.pageSize    
        }

        if(this.filters) options.where = this.filters
        if(this.sorts) options.order = this.sorts

        return options
    }

    toQueryWhere(): FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined {
        return this.filters;
    }

    toQueryOrder(): ObjectType<"ASC" | "DESC"> {
        return Object.keys(this.sorts || {}).reduce<ObjectType<"ASC" | "DESC" >>((result, key) => {
            const value = this.sorts?.[key] as "ASC" | "DESC";
            result[key] = value;
            return result;
        }, {});
    }
}

export class PaginateData<T> {
    constructor(
        public readonly data: Array<T>,
        public readonly meta: PaginationMeta,
    ) {}
}