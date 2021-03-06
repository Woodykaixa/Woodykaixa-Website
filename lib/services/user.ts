import { Err } from '@/dto';
import { BadRequest } from '@/util/error';
import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { uniq } from 'lodash';
export namespace UserService {
  export async function findById(prisma: PrismaClient, id: string) {
    return prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  export async function findByEmail(prisma: PrismaClient, email: string) {
    return prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  export async function findByEmailAndPassword(prisma: PrismaClient, email: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      return bcrypt.compareSync(password, user.password) ? user : null;
    }
    return null;
  }

  export async function createUser(
    prisma: PrismaClient,
    email: string,
    name: string,
    password: string,
    avatarIds: string[],
    isFriend: boolean,
    blog: string | null = null,
    bio: string | null = null
  ) {
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);

    return prisma.user.create({
      data: {
        email,
        name,
        bio,
        blog,
        admin: false,
        avatarIds,
        password: passwordHash,
        registerAt: new Date(),
        isFriend,
      },
    });
  }

  export async function setUserAvatar(prisma: PrismaClient, userId: string, avatarId: string) {
    const user = await findById(prisma, userId);
    if (!user) {
      throw new BadRequest(Err.User.NOT_EXISTS);
    }

    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarIds: uniq([avatarId, ...user.avatarIds]),
      },
    });
  }
}
