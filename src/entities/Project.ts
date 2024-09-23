import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { User } from "./User";
import { ProjectStatus } from "../utils/enums";

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

  // Relación con la entidad User, el líder del proyecto
  @ManyToOne(() => User, (user) => user.projects, { onDelete: "CASCADE" })
  leader: User;

  // Fecha de creación del proyecto
  @CreateDateColumn()
  createdAt: Date;

  // Fecha de actualización del proyecto
  @UpdateDateColumn()
  updatedAt: Date;
}
