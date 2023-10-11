import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError'

interface RegisterServiceRequest {
	name: string
	email: string
	password: string
}

export class CreateUserService {
	constructor(private usersRepository: UsersRepository) {}

	async execute({ name, email, password }: RegisterServiceRequest) {
		const password_hash = await hash(password, 6)

		const userWithSameEmail = await this.usersRepository.findByEmail(email)

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		await this.usersRepository.create({
			name,
			email,
			password_hash
		})

	}
}
