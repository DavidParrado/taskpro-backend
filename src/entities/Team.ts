import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { User } from "./User";
import { Project } from "./Project";

@Entity()
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  // Relación muchos a muchos con usuarios
  @ManyToMany(() => User, (user) => user.teams)
  @JoinTable()
  members: User[];

  // Un equipo pertenece a un solo proyecto
  @OneToOne(() => Project, (project) => project.team)
  project: Project;

  // Definir un líder del equipo
  @ManyToOne(() => User)
  leader: User;

  @Column({ type: "text", nullable: true })
  description?: string;
}
