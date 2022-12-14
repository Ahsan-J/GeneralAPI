import { nanoid } from "nanoid";
import { BaseModel } from "../../helper/model";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Comment } from "./comment/comment.entity";

@Entity()
export class Blog extends BaseModel {
    @PrimaryColumn()
    id: string = nanoid();

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    content: string;

    @ManyToOne(() => User, user => user.blogs)
    @JoinColumn()
    author: User;

    @ManyToMany(() => User, user => user.like_blogs)
    @JoinTable()
    likes: User[];

    @OneToMany(() => Comment, comment => comment.blog)
    @JoinTable()
    comments: Comment[];
}