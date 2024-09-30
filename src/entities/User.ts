import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Project } from "./Project";
import { UserRole } from "../utils/enums";
import { Task } from "./Task";
import { Collaborator } from "./Collaborator";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  // Definición del rol como un array de strings
  @Column("text", { array: true, default: [UserRole.USER] })
  roles: UserRole[];

  // Relación de uno a muchos con Project
  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  // Relación de uno a muchos con Task
  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[];

  // Relación uno a muchos con Collaborator
  @OneToMany(() => Collaborator, (collaborator) => collaborator.user)
  collaborations: Collaborator[];
}
