import {
	Combobox,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ArrowUpRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { FC, ReactNode, useEffect, useState } from 'react'
import {
	CategoriesIcon,
	PostSearchIcon,
	SearchIcon,
	UserSearchIcon,
} from '../Icons/Icons'
import Link from 'next/link'
import clsx from 'clsx'
import getTrans from '@/utils/getTrans'
import { NC_SITE_SETTINGS } from '@/contains/site-settings'
import Empty from '../Empty'
import { gql } from '@/__generated__'
import { getApolloClient } from '@faustwp/core'
import _ from 'lodash'
import { TPostCard } from '../Card2/Card2'
import Loading from '../Button/Loading'
import { getPostDataFromPostFragment } from '@/utils/getPostDataFromPostFragment'
import ncFormatDate from '@/utils/formatDate'
import MyImage from '../MyImage'
import PostTypeFeaturedIcon from '../PostTypeFeaturedIcon/PostTypeFeaturedIcon'

const T = getTrans()

const explores =
	NC_SITE_SETTINGS.search_page?.recommended_searches?.items
		?.map(item => {
			return {
				type: 'recommended_searches',
				id: item?.title || 1,
				name: item?.title || '',
				url: item?.url || '/search/posts/' + item?.title,
				icon: SearchIcon,
			}
		})
		.filter(Boolean) || []

const quickActions = [
	{
		type: 'quick-action',
		name: T['Search posts'],
		icon: PostSearchIcon,
		url: '/search/posts/',
	},
	{
		type: 'quick-action',
		name: T['Search authors'],
		icon: UserSearchIcon,
		url: '/search/authors/',
	},
	{
		type: 'quick-action',
		name: T['Search categories'],
		icon: CategoriesIcon,
		url: '/search/categories/',
	},
]

interface Props {
	renderTrigger?: () => ReactNode
	triggerClassName?: string
}

const SearchModal: FC<Props> = ({ renderTrigger, triggerClassName = '' }) => {
	const client = getApolloClient()

	const [isLoading, setIsLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')

	const [posts, setPosts] = useState<TPostCard[]>([])

	const GQL = gql(`
		#graphql
		query SearchFormQueryGetPostsBySearch(
			$first: Int
			$search: String
		) {
			posts(first: $first, where: { search: $search }) {
				nodes {
					...NcmazFcPostCardFields
				}
				pageInfo {
					endCursor
					hasNextPage
				}
			}
		}
	`)

	function fetchData(query: string) {
		setIsLoading(true)
		client
			.query({
				query: GQL,
				variables: {
					search: query,
					first: 10,
				},
			})
			.then(res => {
				setPosts((res?.data?.posts?.nodes as TPostCard[]) || [])
			})
			.catch(err => {
				console.log(err)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	useEffect(() => {
		if (query !== '') {
			fetchData(query)
		}
	}, [query])

	const handleSetSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value)
	}

	return (
		<>
			<div onClick={() => setOpen(true)} className={triggerClassName}>
				{renderTrigger ? (
					renderTrigger()
				) : (
					<button className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 focus:outline-none sm:h-12 sm:w-12 dark:text-neutral-300 dark:hover:bg-neutral-800">
						<SearchIcon className="h-5 w-5" />
					</button>
				)}
			</div>

			<Transition show={open} afterLeave={() => setQuery('')} appear>
				<Dialog className={`relative z-50`} onClose={setOpen}>
					<TransitionChild
						enter="ease-out duration-200"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-150"
						leaveFrom="opacity-200"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-neutral-900/50 transition-opacity" />
					</TransitionChild>

					<div className="fixed inset-0 z-10 flex w-full overflow-y-auto sm:p-6 md:pb-10 md:pt-20">
						<TransitionChild
							enter="ease-out duration-200"
							enterFrom="opacity-0 translate-y-20 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-150"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-20 sm:translate-y-0 sm:scale-95"
						>
							<DialogPanel className="mx-auto w-full max-w-2xl transform divide-y divide-gray-100 self-end overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 transition-all sm:self-start sm:rounded-xl dark:divide-gray-700 dark:bg-neutral-800 dark:ring-white/10">
								<Combobox onChange={item => console.log(item)}>
									<div className="relative">
										<MagnifyingGlassIcon
											className="pointer-events-none absolute start-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-300"
											aria-hidden="true"
										/>
										<div className="pe-10">
											<ComboboxInput
												autoFocus
												className="h-12 w-full border-0 bg-transparent pe-4 ps-11 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm dark:text-gray-100 dark:placeholder:text-gray-300"
												placeholder={T['Type to search...']}
												onChange={_.debounce(handleSetSearchValue, 200)}
												onBlur={() => setQuery('')}
												defaultValue={query}
											/>
										</div>
										<button
											className="absolute end-4 top-1/2 z-10 -translate-y-1/2 text-sm text-neutral-400 focus:outline-none dark:text-neutral-300"
											onClick={() => setOpen(false)}
										>
											<XMarkIcon className="h-5 w-5" />
										</button>
									</div>

									{isLoading && (
										<div className="flex w-full items-center justify-center py-5">
											<Loading />
										</div>
									)}

									<ComboboxOptions
										static
										as="ul"
										className="max-h-[70vh] scroll-py-2 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-700"
									>
										<li className="p-2">
											{query === '' && (
												<h2 className="mb-2 mt-4 px-3 text-xs font-medium text-gray-500 dark:text-gray-300">
													{T['Recommended searches']}
												</h2>
											)}

											<ul className="text-sm text-gray-700 dark:text-gray-300">
												{query === '' &&
													explores.map(explore => (
														<ComboboxOption
															as={Link}
															key={explore.id}
															value={explore}
															className={({ focus }) =>
																clsx(
																	'flex cursor-default select-none items-center rounded-md px-3 py-2',
																	focus && 'bg-neutral-100 dark:bg-neutral-700',
																)
															}
															href={explore.url}
														>
															{({ focus }) => (
																<>
																	<explore.icon
																		className={clsx(
																			'h-6 w-6 flex-none text-neutral-400 dark:text-gray-300',
																		)}
																		aria-hidden="true"
																	/>
																	<span className="ms-3 flex-auto truncate">
																		{explore.name}
																	</span>
																	{focus && (
																		<span className="ms-3 flex-none text-neutral-500 dark:text-gray-400">
																			<ArrowUpRightIcon className="inline-block h-4 w-4" />
																		</span>
																	)}
																</>
															)}
														</ComboboxOption>
													))}
											</ul>

											<ul className="divide-y divide-gray-100 text-sm text-gray-700 dark:divide-gray-700 dark:text-gray-300">
												{query !== '' &&
													(posts.length
														? posts.map(post => (
																<ComboboxOption
																	as={'li'}
																	key={post.databaseId}
																	value={post}
																	className={({ focus }) =>
																		clsx(
																			'relative flex cursor-default select-none items-center',
																			focus &&
																				'bg-neutral-100 dark:bg-neutral-700',
																		)
																	}
																>
																	{({ focus }) => (
																		<CardPost post={post} focus={focus} />
																	)}
																</ComboboxOption>
															))
														: !isLoading && (
																<div className="py-8 text-center">
																	<Empty />
																</div>
															))}
											</ul>
										</li>

										{!isLoading && (
											<li className="p-2">
												<h2 className="sr-only">Quick actions</h2>
												<ul className="text-sm text-gray-700 dark:text-gray-300">
													{quickActions.map(action => (
														<ComboboxOption
															as={Link}
															key={action.name}
															value={action}
															className={({ focus }) =>
																clsx(
																	'flex cursor-default select-none items-center rounded-md px-3 py-2',
																	focus && 'bg-neutral-100 dark:bg-neutral-700',
																)
															}
															href={action.url + query}
														>
															{({ focus }) => (
																<>
																	<action.icon
																		className={clsx(
																			'h-6 w-6 flex-none text-neutral-400 dark:text-gray-300',
																			focus ? '' : '',
																		)}
																		aria-hidden="true"
																	/>
																	<span className="ms-3 flex-auto truncate">
																		{action.name}
																	</span>
																	<span
																		className={clsx(
																			'ms-3 flex-none text-xs font-semibold text-neutral-400 dark:text-gray-300',
																			focus ? '' : '',
																		)}
																	>
																		<ArrowUpRightIcon className="inline-block h-4 w-4" />
																	</span>
																</>
															)}
														</ComboboxOption>
													))}
												</ul>
											</li>
										)}
									</ComboboxOptions>
								</Combobox>
							</DialogPanel>
						</TransitionChild>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

const CardPost = ({ post, focus }: { post: TPostCard; focus: boolean }) => {
	const {
		title,
		link,
		date,
		categories,
		author,
		postFormats,
		featuredImage,
		uri,
	} = getPostDataFromPostFragment(post)

	return (
		<div
			className={`group relative flex flex-row-reverse gap-3 rounded-2xl p-4 sm:gap-5 ${focus ? '' : ''}`}
		>
			<Link href={uri || ''} className="absolute inset-0 z-0"></Link>
			<div className="space-y-3">
				<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
					<p className="text-xs leading-6 text-neutral-500 xl:text-sm dark:text-neutral-400">
						<span className="capitalize">{author?.name || ''}</span>
						{author?.name && ' · '}
						<time dateTime={date} className="leading-6">
							{ncFormatDate(date)}
						</time>
					</p>

					<Link
						href={categories?.nodes?.[0]?.uri || ''}
						className="relative z-10 rounded-full bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800/80"
					>
						{categories?.nodes?.[0]?.name || ''}
					</Link>
				</div>
				<h4 className="mt-2 text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-300">
					<Link href={uri}>
						<span className="absolute inset-0" />
						<span dangerouslySetInnerHTML={{ __html: post.title || '' }}></span>
					</Link>
				</h4>
			</div>

			<Link
				href={uri || ''}
				className={`relative z-0 hidden h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl sm:block`}
			>
				<MyImage
					sizes="(max-width: 600px) 180px, 400px"
					className="h-full w-full object-cover"
					fill
					src={featuredImage?.sourceUrl || ''}
					alt={title || 'Card Image'}
				/>
				<span className="absolute bottom-1 start-1">
					<PostTypeFeaturedIcon
						wrapSize="h-7 w-7"
						iconSize="h-4 w-4"
						postType={postFormats || ''}
					/>
				</span>
			</Link>
		</div>
	)
}

export default SearchModal
