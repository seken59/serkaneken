import { NcmazFcPostFullFieldsFragment } from '@/__generated__/graphql'
import { FC } from 'react'
import Empty from './Empty'
import Card11Skeleton from './Card11/Card11Skeleton'
import Card11 from './Card11/Card11'
import ButtonPrimary from './Button/ButtonPrimary'
import getTrans from '@/utils/getTrans'

interface Props {
	posts: NcmazFcPostFullFieldsFragment[] | null
	className?: string
	loading?: boolean
	showLoadmore?: boolean
	onClickLoadmore?: () => void
}

const GridPostsArchive: FC<Props> = ({
	className = '',
	posts: currentPosts,
	loading,
	onClickLoadmore,
	showLoadmore,
}) => {
	return (
		<div className={className}>
			{/* LOOP ITEMS */}
			{!currentPosts?.length && !loading ? (
				<Empty />
			) : (
				<div className="mt-8 grid gap-6 sm:grid-cols-2 md:gap-x-7 md:gap-y-8 lg:mt-12 lg:grid-cols-3 xl:grid-cols-4">
					{!currentPosts?.length && loading
						? [1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => <Card11Skeleton key={i} />)
						: (currentPosts || []).map(post => (
								<Card11 key={post.databaseId} post={post} />
							))}
				</div>
			)}

			{/* PAGINATION */}
			{showLoadmore ? (
				<div className="mt-12 flex justify-center lg:mt-14">
					<ButtonPrimary loading={loading} onClick={onClickLoadmore}>
						{getTrans()['Show me more']}
					</ButtonPrimary>
				</div>
			) : null}
		</div>
	)
}

export default GridPostsArchive
