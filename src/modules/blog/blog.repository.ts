import { Repository } from "typeorm";
import { Blog } from "./blog.entity";
import { BadRequestException } from "@nestjs/common";

export class BlogRepository extends Repository<Blog> {
    async findBlogById(id: string): Promise<Blog> {
        if (!id) {
            throw new BadRequestException(`"id" is needed to fetch define. got ${id}`)
        }
      
        const blog = await this.findOne({ where: { id } });
    
        if (!blog) {
            throw new BadRequestException(`No User found for the id ${id}`)
        }

        return blog;
    }
}