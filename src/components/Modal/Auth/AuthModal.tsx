import { AuthModalState, authModalState } from '@/atoms/authModalAtom';
import { Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilState } from 'recoil';
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';

const AuthModal: React.FC = () => {
    const [modalState, setModalState] = useRecoilState(authModalState)

    const handleClose = () => {
        setModalState((prev: AuthModalState) => ({
            ...prev,
            open: false,
        }))
    }
    return (
        <>
            <Modal isOpen={modalState.open} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">
                        {modalState.view === 'login' && 'Login'}
                        {modalState.view === 'signup' && 'Signup'}
                        {modalState.view === 'resetPassword' && 'Reset Password'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        mb={4}
                    >
                        <Flex direction="column" align="center" justify="center" width="70%">
                            <OAuthButtons />
                            <Text color="gray.500" fontWeight="700" fontSize="10pt">OR</Text>
                            <AuthInputs />
                            {/* <ResetPassword /> */}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AuthModal;