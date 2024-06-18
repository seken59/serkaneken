import ButtonPrimary from '@/components/Button/ButtonPrimary'
import ButtonSecondary from '@/components/Button/ButtonSecondary'
import Input from '@/components/Input/Input'
import Label from '@/components/Label/Label'
import NcModal from '@/components/NcModal/NcModal'
import getTrans from '@/utils/getTrans'
import { FC, useRef, useState } from 'react'

interface Props {
	show: boolean
	onCloseModal: () => void
	onSubmit: (value: { url: string; width: number; height: number }) => void
}

const ModalGetYoutube: FC<Props> = ({ show, onCloseModal, onSubmit }) => {
	const [url, setUrl] = useState('')
	const [width, setWidth] = useState(640)
	const [height, setHeight] = useState(480)
	const initialFocusRef = useRef(null)

	const T = getTrans()

	const handleClickSubmitForm = (e: any) => {
		e.preventDefault()
		onSubmit({
			url: url,
			width: width,
			height: height,
		})
		onCloseModal()
	}

	const renderContent = () => {
		return (
			<form
				action="/#"
				className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2"
				onSubmit={handleClickSubmitForm}
			>
				<div className="col-span-2">
					<Label>{T.pageSubmission['Youtube URL']}</Label>
					<Input
						required
						className="mt-1"
						type="url"
						onChange={e => setUrl(e.currentTarget.value)}
						placeholder="https://www.youtube.com/watch?v=abc"
						ref={initialFocusRef}
					/>
				</div>
				<div>
					<Label>{T.Width}</Label>
					<Input
						required
						className="mt-1"
						type="number"
						placeholder="640"
						defaultValue={640}
						onChange={e => {
							setWidth(Number(e.currentTarget.value) || 640)
						}}
						ref={initialFocusRef}
					/>
				</div>
				<div>
					<Label>{T.Height}</Label>
					<Input
						required
						className="mt-1"
						type="number"
						placeholder="480"
						defaultValue={480}
						onChange={e => {
							setHeight(Number(e.currentTarget.value) || 480)
						}}
						ref={initialFocusRef}
					/>
				</div>

				<div className="mt-4 space-x-3">
					<ButtonPrimary type="submit">{T.Apply}</ButtonPrimary>
					<ButtonSecondary type="button" onClick={onCloseModal}>
						{T.Cancel}
					</ButtonSecondary>
				</div>
			</form>
		)
	}

	return (
		<NcModal
			renderTrigger={() => null}
			isOpenProp={show}
			renderContent={renderContent}
			onCloseModal={onCloseModal}
			contentExtraClass="max-w-screen-sm"
			modalTitle={T.pageSubmission['Youtube URL']}
			initialFocusRef={initialFocusRef}
		/>
	)
}

export default ModalGetYoutube
