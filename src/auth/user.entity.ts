import { Task } from "src/tasks/task.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Role } from "./role.enum";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique:true})
    username: string;

    @Column()
    password: string;
    
    @Column({ unique:true})
    email: string;

    @Column({ unique:true })
    phone: string;

    @Column({default: Role.User})
    role: Role;

    @Column({nullable:true})
    profileImage:string;

    @OneToMany((_type) => Task, (task) => task.user , {eager: true})
    tasks: Task[];

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}