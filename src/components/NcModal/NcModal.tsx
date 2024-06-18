'use client'
import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import { Dialog, Transition } from '@/app/headlessui'
import Button from '../Button/Button'
import ButtonClose from '../ButtonClose/ButtonClose'
import { DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'

export interface NcModalProps {
	renderContent: (closeModal: () => void) => ReactNode
	renderFooter?: (closeModal: () => void) => ReactNode
	renderTrigger?: (openModal: () => void) => ReactNode
	enableFooter?: boolean
	containerClassName?: string
	contentExtraClass?: string
	contentPaddingClass?: string
	triggerText?: ReactNode
	modalTitle?: ReactNode
	isOpenProp?: boolean
	onCloseModal?: () => void
	leaveAnimationClass?: string
	initialFocusRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement>
}

const NcModal: FC<NcModalProps> = ({
	renderTrigger,
	renderContent,
	renderFooter,
	enableFooter = true,
	containerClassName = '',
	contentExtraClass = 'max-w-screen-xl',
	contentPaddingClass = 'p-4 md:px-6 md:py-5',
	triggerText = 'Open Modal',
	modalTitle = 'Modal title',
	isOpenProp,
	onCloseModal,
	leaveAnimationClass = 'ease-in duration-100',
	initialFocusRef,
}) => {
	let [isOpen, setIsOpen] = useState(!!isOpenProp)

	function closeModal() {
		if (typeof isOpenProp !== 'boolean') {
			setIsOpen(false)
		}
		onCloseModal && onCloseModal()
	}

	function openModal() {
		if (typeof isOpenProp !== 'boolean') {
			setIsOpen(true)
		}
	}

	useEffect(() => {
		setIsOpen(!!isOpenProp)
	}, [isOpenProp])

	return (
		<div className={`nc-Modal ${containerClassName}`}>
			{renderTrigger ? (
				renderTrigger(openModal)
			) : (
				<Button onClick={openModal}> {triggerText} </Button>
			)}

			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="fixed inset-0 z-50" onClose={closeModal}>
					<div className="min-h-screen px-1 text-center md:px-4">
						<TransitionChild
							as={Fragment}
							enter="ease-out duration-100"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div
								className="fixed inset-0 bg-neutral-900 bg-opacity-50 dark:bg-opacity-80"
								aria-hidden="true"
							/>
						</TransitionChild>

						{/* This element is to trick the browser into centering the modal contents. */}
						<span
							className="inline-block h-screen align-middle"
							aria-hidden="true"
						>
							&#8203;
						</span>
						<TransitionChild
							as={Fragment}
							enter="ease-out duration-100"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave={leaveAnimationClass}
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<DialogPanel
								className={`inline-flex w-full transform flex-col overflow-hidden rounded-2xl border border-black border-opacity-5 bg-white text-left align-middle text-neutral-900 shadow-xl transition-all dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 ${contentExtraClass} max-h-[85vh]`}
							>
								<header
									className={`relative flex-shrink-0 px-6 py-4 text-center ${
										!!modalTitle
											? 'border-b border-neutral-100 md:py-5 dark:border-neutral-700'
											: ''
									}`}
								>
									<ButtonClose
										onClick={closeModal}
										className="absolute left-2 top-2 sm:left-3 sm:top-3"
									/>
									{!!modalTitle && (
										<DialogTitle
											as="h3"
											className="mx-10 text-base font-semibold text-neutral-900 lg:text-xl dark:text-neutral-200"
										>
											{modalTitle}
										</DialogTitle>
									)}
								</header>
								<div
									className={`flex-1 overflow-y-auto ${contentPaddingClass}`}
								>
									{renderContent(closeModal)}
								</div>

								{renderFooter && enableFooter && (
									<footer className="flex-shrink-0">
										<div className="border-t border-neutral-100 px-6 py-4 md:py-5 dark:border-neutral-700">
											{renderFooter(closeModal)}

											{/* -------------  example ----------- */}
											{/* <div className="flex justify-between">
                        <Button
                          sizeClass="py-2.5 px-4 sm:py-3 sm:px-5"
                          pattern="link"
                          onClick={closeModal}
                        >
                          Close
                        </Button>
                        <ButtonPrimary>Show me more</ButtonPrimary>
                      </div> */}
										</div>
									</footer>
								)}
							</DialogPanel>
						</TransitionChild>
					</div>
				</Dialog>
			</Transition>
		</div>
	)
}

export default NcModal
