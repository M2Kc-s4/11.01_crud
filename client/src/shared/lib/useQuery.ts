import {
	createContext,
	useContext,
	useMemo,
	useState,
	useEffect,
	useRef,
	useCallback,
	type PropsWithChildren,
	createElement,
} from 'react'

import { Future } from 'fluent-future'

const EMPTY_TAGS: string[] = []
const EMPTY_DEPS: unknown[] = []


class QueryRegistry {
	private registry = new Map<string, Set<() => void>>()
	private cache = new Map<string, unknown>()

	getCached<T>(key: string): T | undefined {
		return this.cache.get(key) as T | undefined
	}

	setCached<T>(key: string, data: T): void {
		this.cache.set(key, data)
	}

	register(tags: string[], refetch: () => void): () => void {
		for (const tag of tags) {
			if (!this.registry.has(tag)) this.registry.set(tag, new Set())
			this.registry.get(tag)!.add(refetch)
		}

		return () => {
			for (const tag of tags) {
				this.registry.get(tag)?.delete(refetch)
			}
		}
	}

	refetch(tags: string[]): void {
		const toRefetch = new Set<() => void>()
		for (const tag of tags) {
			this.registry.get(tag)?.forEach(r => toRefetch.add(r))
		}
		for (const refetch of toRefetch) refetch()
	}
}

const QueryRegistryContext = createContext<QueryRegistry | null>(null)

export function QueryRegistryProvider({ children }: PropsWithChildren) {
	const registry = useMemo(() => new QueryRegistry(), [])

	return createElement(QueryRegistryContext.Provider, { value: registry }, children)
}

export function useQueryRegistry() {
	const registry = useContext(QueryRegistryContext)
	if (!registry) throw new Error('ComposeRegistryProvider missing')

	return registry
}

type UseQueryOptions<T, E> = {
	query: () => Future<T, E>
	key?: string
	tags?: string[] | string
	enabled?: boolean
	deps?: unknown[]
}

type UseQueryResult<T, E> = {
	data: T | undefined
	error: E | undefined
	isLoading: boolean
	isFetching: boolean
	isError: boolean
	isSuccess: boolean
	refetch: () => void
}

type QueryState<T, E> = {
	data: T | undefined
	error: E | undefined
	isLoading: boolean
	isFetching: boolean
	isError: boolean
	isSuccess: boolean
}


export function useQuery<T, E = unknown>({
	query,
	enabled = true,
	tags = EMPTY_TAGS,
	deps = EMPTY_DEPS,
	key
}: UseQueryOptions<T, E>): UseQueryResult<T, E> {
	const registry = useQueryRegistry()
	const [state, setState] = useState<QueryState<T, E>>(() => {
		const cached = key ? registry.getCached<T>(key) : undefined
		return {
			data: cached,
			error: undefined,
			isLoading: cached === undefined,
			isFetching: false,
			isError: false,
			isSuccess: cached !== undefined,
		}
	})

	const queryRef = useRef(query)
	queryRef.current = query

	const keyRef = useRef(key)
	keyRef.current = key

	const tagsArray = typeof tags === 'string' ? [tags] : tags

	const run = useCallback((): void => {
		setState(s => ({
			...s,
			isLoading: s.data === undefined,
			isFetching: true,
			isError: false,
			isSuccess: false,
		}))

		queryRef.current()
			.tap(data => {
				if (keyRef.current) registry.setCached(keyRef.current, data)
				setState({
					data,
					error: undefined,
					isLoading: false,
					isFetching: false,
					isError: false,
					isSuccess: true,
				})
			})
			.tapErr(error => {
				setState(s => ({
					...s,
					error,
					isLoading: false,
					isFetching: false,
					isError: true,
					isSuccess: false,
				}))
			})
	}, [])

	useEffect(() => {
		if (enabled) run()
	}, [enabled, ...deps])

	useEffect(() => {
		const unregister = registry.register(tagsArray, run)
		return unregister
	}, [registry])

	return { ...state, refetch: run }
}


type FutureFunction<T, E, P extends Array<any>> = (...args: P) => Future<T, E>


type UseMutationOptions<T, E, P extends Array<any>> = {
	mutation: FutureFunction<T, E, P>
	refetches?: ((data: T, ...args: P) => string[] | string) | string[] | string
	onSuccess?: (data: T) => void
	onError?: (error: E) => void
}


type UseMutationResult<T, E, P extends Array<any>> = {
	mutate: (...args: P) => Future<T, E>
	isPending: boolean
	isError: boolean
	isSuccess: boolean
}


type MutationState = {
	isPending: boolean
	isError: boolean
	isSuccess: boolean
}


export function useMutation<T, E, P extends Array<any>>(params: UseMutationOptions<T, E, P>): UseMutationResult<T, E, P> {
	const registry = useQueryRegistry()
	const [state, setState] = useState<MutationState>({
		isPending: false,
		isError: false,
		isSuccess: false,
	})

	const mutation = useRef(params.mutation)
	mutation.current = params.mutation
	const refetches = useRef(params.refetches)
	refetches.current = params.refetches
	const onSuccess = useRef(params.onSuccess)
	onSuccess.current = params.onSuccess
	const onError = useRef(params.onError)
	onError.current = params.onError

	const mutate = useCallback((...args: P): Future<T, E> => {
		setState({ isPending: true, isError: false, isSuccess: false })

		const future = mutation.current(...args)

		void future.tap(data => {
			if (refetches.current) {
				const toRefetch = typeof refetches.current === "function"
					? refetches.current(data, ...args)
					: refetches.current
				registry.refetch(
					typeof toRefetch === 'string'
						? 	[toRefetch]
						:   toRefetch
				) 
			}

			onSuccess.current?.(data)
			setState({ isPending: false, isError: false, isSuccess: true })
		})

		void future.tapErr(error => {
			onError.current?.(error)
			setState({ isPending: false, isError: true, isSuccess: false })
		})

		return future
	}, [registry])

	return {
		mutate,
		...state,
	}
}

export type {
	UseQueryOptions,
	UseQueryResult,
	UseMutationOptions,
	UseMutationResult
}