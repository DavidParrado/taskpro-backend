import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
  BaseEntity,
  OneToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Project } from "./Project";
import { Collaborator } from "./Collaborator";

@Entity()
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  // Relación muchos a muchos con usuarios
  @OneToMany(() => Collaborator, (collaborator) => collaborator.team)
  collaborators: User[];

  // Un equipo pertenece a un solo proyecto
  @OneToOne(() => Project, (project) => project.team)
  project: Project;

  // Definir un líder del equipo
  @ManyToOne(() => User)
  leader: User;

  @Column({ type: "text", nullable: true })
  description?: string;
}
