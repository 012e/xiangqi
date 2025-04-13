/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {faker} from '@faker-js/faker';

import {delay, http, HttpResponse} from 'msw';

import type {HealthAuth200} from '.././model';


export const getHealthResponseMock = (): string => (faker.word.sample())

export const getHealthAuthResponseMock = (): HealthAuth200 => ({
    [faker.string.alphanumeric(5)]: {}
})


export const getHealthMockHandler = (overrideResponse?: string | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<string> | string)) => {
    return http.get('*/health/hello', async (info) => {
        await delay(1000);

        return new HttpResponse(JSON.stringify(overrideResponse !== undefined
                ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
                : getHealthResponseMock()),
            {
                status: 200,
                headers: {'Content-Type': 'application/json'}
            })
    })
}

export const getHealthAuthMockHandler = (overrideResponse?: HealthAuth200 | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<HealthAuth200> | HealthAuth200)) => {
    return http.get('*/health/auth', async (info) => {
        await delay(1000);

        return new HttpResponse(JSON.stringify(overrideResponse !== undefined
                ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
                : getHealthAuthResponseMock()),
            {
                status: 200,
                headers: {'Content-Type': 'application/json'}
            })
    })
}
export const getHealthControllerMock = () => [
    getHealthMockHandler(),
    getHealthAuthMockHandler()
]
