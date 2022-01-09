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

  export async function findByGitHubId(prisma: PrismaClient, id: number) {
    return prisma.user.findFirst({
      where: {
        github_id: id,
      },
    });
  }

  export async function createUser(
    prisma: PrismaClient,
    githubId: number,
    email: string,
    name: string,
    password: string,
    avatarIds: string[],
    blog: string | null = null,
    bio: string | null = null
  ) {
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);

    return prisma.user.create({
      data: {
        github_id: githubId,
        email,
        name,
        bio,
        blog,
        admin: false,
        avatarIds,
        password: passwordHash,
        salt,
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
