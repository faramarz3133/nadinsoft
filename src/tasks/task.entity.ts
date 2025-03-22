import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/auth/user.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title:string;

    @Column()
    description: string;

    @Column({ nullable: true })
    attachment: string;

    @ManyToOne((_type) => User , (user) => user.tasks ,{ onDelete: "CASCADE", eager: false })
    @Exclude({toPlainOnly:true})
    user: User;

    @CreateDateColumn()
    createdAt:Date;
    
    @UpdateDateColumn()
    updatedAt:Date;
} 