import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, BaseEntity } from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class Assignment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.assignments)
  user: User;

  @ManyToOne(() => Task, (task) => task.assignments, { onDelete: "CASCADE" })
  task: Task;

  @Column({ nullable: true })
  role: string; // Rol del colaborador (ejemplo: "responsable", "revisor", etc.)
}
