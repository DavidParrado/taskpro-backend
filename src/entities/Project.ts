import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { ProjectStatus } from "../utils/enums";
import { Task } from "./Task";
import { Team } from "./Team";
import { Collaborator } from "./Collaborator";

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "timestamp", nullable: true })
  startDate: Date;

  @Column({ type: "timestamp", nullable: true })
  endDate: Date;

  @Column({
    type: "enum",
    enum: ProjectStatus,
    default: ProjectStatus.IN_PROGRESS,
  })
  status: ProjectStatus;
  // Fecha de creación del proyecto
  @CreateDateColumn()
  createdAt: Date;

  // Fecha de actualización del proyecto
  @UpdateDateColumn()
  updatedAt: Date;

  // Relación con la entidad User, el líder del proyecto
  @ManyToOne(() => User, (user) => user.projects, { onDelete: "CASCADE" })
  owner: User;

  // Relación uno a muchos con Task
  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToOne(() => Team, { cascade: true })
  @JoinColumn()
  team: Team;

  // Relación uno a muchos con Collaborator
  @OneToMany(() => Collaborator, (collaborator) => collaborator.project)
  collaborators: Collaborator[];
}
