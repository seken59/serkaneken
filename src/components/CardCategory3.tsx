import { FC } from 'react'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Link from 'next/link'
import MyImage from './MyImage'

export interface CardCategory3Props {
	className?: string
}

const CardCategory3: FC<CardCategory3Props> = ({ className = '' }) => {
	return (
		<Link
			href={'/archive/demo-slug'}
			className={`nc-CardCategory3 block ${className}`}
		>
			<div
				className={`group aspect-h-11 aspect-w-16 relative h-0 w-full overflow-hidden rounded-2xl bg-sky-100 sm:aspect-h-9`}
			>
				<div>
					<div className="absolute inset-5 sm:inset-8">
						<MyImage
							alt="ads"
							src={''}
							className="absolute right-0 h-full w-1/2 max-w-[260px] object-contain drop-shadow-xl"
						/>
					</div>
				</div>
				<span className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-40"></span>

				<div>
					<div className="absolute inset-5 flex flex-col sm:inset-8">
						<div className="max-w-xs">
							<span className={`mb-2 block text-sm text-neutral-700`}>
								Sponsored
							</span>
							<h2
								className={`text-xl font-semibold text-neutral-900 md:text-2xl`}
							>
								Up to <br /> 80% off retail
							</h2>
						</div>
						<div className="mt-auto">
							<ButtonPrimary
								sizeClass="py-3 px-4 sm:py-3.5 sm:px-6"
								fontSize="text-sm font-medium"
								className="nc-shadow-lg"
							>
								Show me more
							</ButtonPrimary>
						</div>
					</div>
				</div>
			</div>
		</Link>
	)
}

export default CardCategory3
