import ButtonPrimary from '@/components/Button/ButtonPrimary'
import ButtonSecondary from '@/components/Button/ButtonSecondary'
import ButtonThird from '@/components/Button/ButtonThird'
import Input from '@/components/Input/Input'
import Label from '@/components/Label/Label'
import NcModal from '@/components/NcModal/NcModal'
import getTrans from '@/utils/getTrans'
import { FC, useEffect, useRef, useState } from 'react'

interface ModalGetLinkProps {
	onSubmit: (url: string, openInNewTab: boolean) => void
	onCloseModal: () => void
	isOpen: boolean
	defaultLink: string
}

const ModalGetLink: FC<ModalGetLinkProps> = ({
	onSubmit,
	isOpen,
	onCloseModal,
	defaultLink,
}) => {
	const initialFocusRef = useRef(null)

	const T = getTrans()
	const [urlState, setUrlState] = useState('')
	const [openInNewTab, setOpenInNewTab] = useState(false)

	useEffect(() => {
		setUrlState(defaultLink)
	}, [defaultLink])

	function closeModal() {
		onCloseModal()
	}

	const handleApply = () => {
		onSubmit(urlState, openInNewTab)
		closeModal()
	}

	const handleRemoveLink = () => {
		onSubmit('', false)
		closeModal()
	}

	const renderContent = () => {
		return (
			<div>
				<div className="relative flex flex-col space-y-5 px-5 py-6">
					{renderInsertFromUrl()}
				</div>
				<div className="flex items-center justify-between bg-neutral-50 p-5 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
					<ButtonThird onClick={closeModal} sizeClass="px-4 py-2 sm:px-5">
						{T.Cancel}
					</ButtonThird>
					<div>
						<ButtonSecondary
							className="ml-2"
							onClick={handleRemoveLink}
							sizeClass="px-4 py-2 sm:px-5"
						>
							{T.pageSubmission['Unset link']}
						</ButtonSecondary>
						<ButtonPrimary
							className="ml-2"
							onClick={handleApply}
							sizeClass="px-4 py-2 sm:px-5"
						>
							{T.Apply}
						</ButtonPrimary>
					</div>
				</div>
			</div>
		)
	}

	const renderInsertFromUrl = () => {
		return (
			<>
				<form
					className="block"
					onSubmit={event => {
						event.preventDefault()
						handleApply()
					}}
					action="/#"
				>
					<Label htmlFor="url">Paste or type a link</Label>
					<Input
						className="mt-1"
						rounded="rounded-xl"
						type={'url'}
						onChange={e => setUrlState(e.target.value)}
						defaultValue={urlState}
						ref={initialFocusRef}
						id="url"
					/>

					<div className="mt-5 flex items-center space-x-2 text-sm text-neutral-700">
						<input
							type="checkbox"
							className="rounded-md text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400"
							id="open-in-new-tab"
							checked={openInNewTab}
							onChange={e => setOpenInNewTab(e.target.checked)}
						/>
						<Label htmlFor="open-in-new-tab">Open in new tab</Label>
					</div>
				</form>
			</>
		)
	}

	return (
		<NcModal
			contentPaddingClass=""
			isOpenProp={isOpen}
			onCloseModal={closeModal}
			contentExtraClass="max-w-screen-md"
			renderContent={renderContent}
			renderTrigger={() => null}
			modalTitle=""
			initialFocusRef={initialFocusRef}
		/>
	)
}

export default ModalGetLink
