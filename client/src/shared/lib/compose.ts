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

function tagsKey(tags: string[]): string {
	return [...tags].sort().join('\0')
}

class QueryRegistry {
	private registry = new Map<string, Set<() => void>>()

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

	invalidate(...tags: string[]): void {
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
	tags: string[]
	enabled?: boolean
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

function shallowEqualArrays(a: string[], b: string[]): boolean {
	if (a.length !== b.length) return false

	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false
	}

	return true
}

export function useQuery<T, E = unknown>(params: UseQueryOptions<T, E>): UseQueryResult<T, E> {
	const registry = useQueryRegistry()
	const [state, setState] = useState<QueryState<T, E>>({
		data: undefined,
		error: undefined,
		isLoading: false,
		isFetching: false,
		isError: false,
		isSuccess: false,
	})

	const enabled = params.enabled ?? true

	const query = useRef(params.query)
	query.current = params.query

	const tags = useRef<string[]>(params.tags)
	const isFirstRun = useRef(true)

	const key = useMemo(() => tagsKey(params.tags), [params.tags])

	const enabledRef = useRef(enabled)
	enabledRef.current = enabled

	const run = useCallback((): void => {
		if (!enabledRef.current) return

		setState(s => ({
			...s,
			isLoading: s.data === undefined,
			isFetching: true,
			isError: false,
			isSuccess: false,
		}))

		query.current()
			.tap(data => {
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
		const tagsChanged = !shallowEqualArrays(tags.current, params.tags)
		tags.current = params.tags

		if (!enabled) {
			isFirstRun.current = false
			return
		}

		if (isFirstRun.current) {
			isFirstRun.current = false
			
			run()
			return
		}

		if (tagsChanged) {			
			run()
			return
		}
	}, [key, enabled])

	useEffect(() => {
		if (!enabled) return

		const unregister = registry.register(params.tags, run)
		return unregister
	}, [key, registry, enabled])

	return { ...state, refetch: run }
}


type FutureFunction<T, E, P extends Array<any>> = (...args: P) => Future<T, E>


type UseMutationOptions<T, E, P extends Array<any>> = {
	mutation: FutureFunction<T, E, P>
	invalidates?: ((data: T, ...args: P) => string[]) | string[]
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
	const invalidates = useRef(params.invalidates)
	invalidates.current = params.invalidates
	const onSuccess = useRef(params.onSuccess)
	onSuccess.current = params.onSuccess
	const onError = useRef(params.onError)
	onError.current = params.onError

	const mutate = useCallback((...args: P): Future<T, E> => {
		setState({ isPending: true, isError: false, isSuccess: false })

		const future = mutation.current(...args)

		void future.tap(data => {
			if (invalidates.current) {
				registry.invalidate(...
					typeof invalidates.current === "function"
						? invalidates.current(data, ...args)
						: invalidates.current
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