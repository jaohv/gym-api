import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckInService } from './checkInService'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('Check in Service', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInService(checkInsRepository, gymsRepository)

		gymsRepository.items.push({
			id: 'gym-01',
			title: 'JavaScript Gym',
			description: '',
			latitude: new Decimal(-29.7095584),
			longitude: new Decimal(-51.1480857),
			phone: ''
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -29.7095584,
			userLongitude: -51.1480857,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -29.7095584,
			userLongitude: -51.1480857,
		})

		await expect(() => sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -29.7095584,
			userLongitude: -51.1480857,
		})).rejects.toBeInstanceOf(Error)
	})

	it('should be able to check in twice but in the different days', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -29.7095584,
			userLongitude: -51.1480857,
		})

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -29.7095584,
			userLongitude: -51.1480857,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in on distant gym', async () => {
		gymsRepository.items.push({
			id: 'gym-02',
			title: 'JavaScript Gym',
			description: '',
			latitude: new Decimal(-29.6621978),
			longitude: new Decimal(-51.1246747),
			phone: ''
		})

		await expect(() => sut.execute({
			gymId: 'gym-02',
			userId: 'user-01',
			userLatitude: -29.7095584,
			userLongitude: -51.1480857,
		})).rejects.toBeInstanceOf(Error)
	})
})    