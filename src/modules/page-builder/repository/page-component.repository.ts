import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { PageComponent } from "../entity/page-component.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PageComponentRepository extends Repository<PageComponent> {
    constructor( 
        @InjectRepository(PageComponent)
        repository: Repository<PageComponent>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
    
}