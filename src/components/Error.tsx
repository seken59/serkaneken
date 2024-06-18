import { FC } from 'react'

interface ErrorProps {
	error: any
	className?: string
}

const Error: FC<ErrorProps> = ({ error, className = 'py-5' }) => {
	if (!error) return null

	return (
		<div
			className={`prose-not max-w-lg overflow-hidden text-xs italic text-red-500 dark:text-red-400 ${className}`}
		>
			{typeof error === 'string' && (
				<span dangerouslySetInnerHTML={{ __html: error }}></span>
			)}
			{typeof error !== 'string' && <pre>{JSON.stringify(error, null, 2)}</pre>}
		</div>
	)
}

export default Error
