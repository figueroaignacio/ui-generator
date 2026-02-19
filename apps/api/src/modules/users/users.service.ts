import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return await this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find({
      select: [
        'id',
        'username',
        'email',
        'avatarUrl',
        'bio',
        'location',
        'profileUrl',
        'createdAt',
      ],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'avatarUrl',
        'bio',
        'location',
        'profileUrl',
        'createdAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByGithubId(githubId: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { githubId },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);

    return await this.userRepo.save(user);
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.userRepo.update(userId, { refreshToken });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return await this.userRepo.remove(user);
  }
}
