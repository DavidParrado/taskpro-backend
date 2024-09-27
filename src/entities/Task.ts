import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

export enum TaskStatus {
  TODO = "Pendiente",
  IN_PROGRESS = "En progreso",
  COMPLETED = "Completado",
}

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({ type: "timestamp", nullable: true })
  dueDate: Date;

  // Relación con la entidad User (asignado)
  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: true,
    onDelete: "SET NULL",
  })
  assignee: User | null; // Acepta null

  // Relación con la entidad Project
  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "CASCADE" })
  project: Project;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
