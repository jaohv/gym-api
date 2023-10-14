import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError'
import { User } from '@prisma/client'

interface CreateUserServiceRequest {
	name: string
	email: string
	password: string
}

interface CreateUserServiceResponse {
	user: User
}

export class CreateUserService {
	constructor(private usersRepository: UsersRepository) {}

	async execute({ name, email, password }: CreateUserServiceRequest) : Promise<CreateUserServiceResponse> {
		const password_hash = await hash(password, 6)

		const userWithSameEmail = await this.usersRepository.findByEmail(email)

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		const user = await this.usersRepository.create({
			name,
			email,
			password_hash
		})


		return {
			user,
		}
	}
}

