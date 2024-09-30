import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, BaseEntity } from "typeorm";
import { Task } from "./Task";

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  color: string;

  @ManyToMany(() => Task, (task) => task.tags)
  tasks: Task[];
}
