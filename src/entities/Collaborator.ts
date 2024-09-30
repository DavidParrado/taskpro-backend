import { Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from "typeorm";
import { User } from "./User";
import { Project } from "./Project";
import { Team } from "./Team";

@Entity()
export class Collaborator extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.collaborations)
  user: User;

  @ManyToOne(() => Project, (project) => project.collaborators)
  project: Project;

  @ManyToOne(() => Team, (team) => team.collaborators)
  team: Team;
}
