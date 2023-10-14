import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateUserService } from '../createUserService'

export function makeCreateUserService() {
	const prismaUsersRespository = new PrismaUsersRepository
	const createUserService =  new CreateUserService(prismaUsersRespository)

	return createUserService
}