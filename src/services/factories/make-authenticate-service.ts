import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '../authenticateService'

export function makeAuthenticateService() {
	const prismaUsersRespository = new PrismaUsersRepository
	const authenticateService =  new AuthenticateService(prismaUsersRespository)

	return authenticateService
}