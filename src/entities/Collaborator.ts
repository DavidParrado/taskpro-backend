import { Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from "typeorm";
import { User } from "./User";
import { Project } from "./Project";
import { Team } from "./Team";

@Entity()
export class Collaborator extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.collaborations, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  user: User;

  @ManyToOne(() => Team, (team) => team.collaborators, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  team: Team;
}
