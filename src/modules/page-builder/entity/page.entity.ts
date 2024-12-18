import { BaseModel } from "@/common/entity/base.entity";
import { Column, Entity, JoinTable, OneToMany } from "typeorm";
import { PageStatus, PageType } from "../page.enum";
import { ObjectType } from "@/common/types/collection.type";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";
import { Row } from "./row.entity";
import { JsonTransformer } from "@/common/transformer/object.transformer";

const bitwiseOperator = new BitwiseOperator<PageStatus>();

@Entity()
export class Page extends BaseModel {

    @Column()
    name: string;

    @Column()
    alias: string;

    @Column({type: 'int', name: 'page_type', default: PageType.SPA })
    pageType: PageType;

    @Column({ type: 'text', default: null, name: "custom_js" })
    customJs: string;

    @Column({ default: null, type: 'text', name: "custom_css" })
    customCss: string ;

    @Column({type: 'text', transformer: new JsonTransformer(), nullable: true, default: null})
    meta?: ObjectType<string>;

    @Column({ nullable: true })
    password?: string;

    @OneToMany("Row", "page", { lazy: true })
    @JoinTable()
    rows: Array<Row>

    get isActive(): boolean {
        return bitwiseOperator.hasValue(this.status, PageStatus.ACTIVE)
    }

    set isActive(value: boolean) {
        if(value) {
            this.status = bitwiseOperator.setValue(this.status, PageStatus.ACTIVE)
        } else {
            this.status = bitwiseOperator.removeValue(this.status, PageStatus.ACTIVE)
        }
    }
}