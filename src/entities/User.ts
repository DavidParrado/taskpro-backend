import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Project } from "./Project";
import { UserRole } from "../utils/enums";

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
  @OneToMany(() => Project, (project) => project.leader)
  projects: Project[];
}
