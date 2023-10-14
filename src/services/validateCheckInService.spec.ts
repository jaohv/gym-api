import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInService } from './validateCheckInService'
import { ResourceNotFoundError } from './errors/resourceNotFoundError'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe('Validate Check In Service', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInService(checkInsRepository)

		// vi.useFakeTimers()
	})

	afterEach(() => {
		// vi.useRealTimers()
	})

	it('should be able to validate the check-in', async () => {
		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01',
		})


        
		const { checkIn } = await sut.execute({
			checkInId: createdCheckIn.id
		})

		expect(checkIn.validated_at).toEqual(expect.any(Date))
		expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
	})

	it('should not be able to validate an inexistent check-in', async () => {        
		await expect(() => sut.execute({
			checkInId: 'inexistent-check-in-id'
		})).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

})    