import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { AvailabilitySlot } from "./entities/availability-slot.entity";
import { RefreshToken } from "./entities/refresh-token.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { EventsModule } from "../events/events.module";
import { JwtConfigModule } from "../common/jwt-config.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AvailabilitySlot, RefreshToken]),
    EventsModule,
    JwtConfigModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
