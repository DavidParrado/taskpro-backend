import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Project } from "./Project";
import { User } from "./User";
import { Tag } from "./Tag";

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

  // Relación muchos a muchos con Tag
  @ManyToMany(() => Tag, (tag) => tag.tasks)
  @JoinTable({
    name: "task_tags", // Tabla intermedia para la relación muchos a muchos
    joinColumn: {
      name: "task_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "tag_id",
      referencedColumnName: "id",
    },
  })
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
