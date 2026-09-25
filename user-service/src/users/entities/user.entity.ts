import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AvailabilitySlot } from "./availability-slot.entity";
import { RefreshToken } from "./refresh-token.entity";

export enum UserRole {
  STUDENT = "student",
  TUTOR = "tutor",
  ADMIN = "admin",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ type: "enum", enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  full_name: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => AvailabilitySlot, (slot) => slot.user)
  availabilitySlots: AvailabilitySlot[];

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];
}
