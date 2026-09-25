import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserRole } from "./entities/user.entity";
import { AvailabilitySlot } from "./entities/availability-slot.entity";
import { EventsPublisher } from "../events/events.publisher";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(AvailabilitySlot)
    private readonly slotsRepo: Repository<AvailabilitySlot>,
    private readonly eventsPublisher: EventsPublisher,
  ) {}

  // Lista de usuarios para las pestañas "Tutores"/"Estudiantes" del
  // frontend; filtra por rol cuando se pide (?role=student|tutor).
  async findAll(role?: UserRole) {
    const where = role ? { role } : {};
    const users = await this.usersRepo.find({ where, order: { created_at: "DESC" } });
    return users.map((u) => this.toPublicProfile(u));
  }

  // Solo un admin puede eliminar cuentas (ver permisos de rol admin).
  // Publica user.deleted para que Catalog limpie el tutor_profile asociado
  // si el usuario eliminado era tutor.
  async deleteUser(id: string) {
    const user = await this.findById(id);
    await this.usersRepo.remove(user);
    this.eventsPublisher.publishUserDeleted({ userId: id, role: user.role });
    return { deleted: true, userId: id };
  }

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ["availabilitySlots"],
    });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return user;
  }

  createUser(data: Partial<User>) {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async getAvailability(userId: string) {
    await this.findById(userId); // valida que exista
    return this.slotsRepo.find({ where: { user: { id: userId } } });
  }

  async setAvailability(
    userId: string,
    slots: { day_of_week: number; start_time: string; end_time: string }[],
  ) {
    const user = await this.findById(userId);
    await this.slotsRepo.delete({ user: { id: userId } });
    const created = slots.map((s) =>
      this.slotsRepo.create({ ...s, user }),
    );
    return this.slotsRepo.save(created);
  }

  // Proyección pública mínima: lo único que otros servicios (Catalog) deben ver.
  toPublicProfile(user: User) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    };
  }
}
