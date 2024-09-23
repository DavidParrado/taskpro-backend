import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Project } from "./Project";

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

  @Column({ default: "user" })
  role: string;

  // Relación de uno a muchos con Project
  @OneToMany(() => Project, (project) => project.leader)
  projects: Project[];
}
