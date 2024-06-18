import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { FC, useState } from 'react'
import Button, { ButtonProps } from './Button/Button'
import ButtonPrimary from './Button/ButtonPrimary'

export interface FollowButtonProps extends ButtonProps {
	isFollowing?: boolean
}

const FollowButton: FC<FollowButtonProps> = ({
	className,
	sizeClass,
	fontSize,
	isFollowing = Math.random() > 0.5,
}) => {
	const [following, setFollowing] = useState(isFollowing)

	return !following ? (
		<ButtonPrimary
			className={className}
			sizeClass={sizeClass}
			fontSize={fontSize}
			onClick={() => setFollowing(true)}
		>
			<PlusCircleIcon className="h-5 w-5 sm:-ms-2.5" />
			<span className="ms-2">Follow</span>
		</ButtonPrimary>
	) : (
		<Button
			className={className}
			sizeClass={sizeClass}
			fontSize={fontSize}
			onClick={() => setFollowing(false)}
		>
			<span className="text-sm">Following</span>
		</Button>
	)
}

export default FollowButton
