import { createCommunity, joinCommunity } from '@/supabase/community';
import { Box, Button, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { createCipheriv } from 'crypto';
import React, { useState } from 'react';

type CreateCommunityProps = {
    open: boolean
    handleClose: () => void
};

const CreateCommunity: React.FC<CreateCommunityProps> = ({ open, handleClose }) => {

    const sb = useSupabaseClient()
    const [communityName, setCommunityName] = useState('')
    const user = useUser()
    const [communityCode, setCommunityCode] = useState('')
    const [charsRemaining, SetCharsRemaining] = useState(21)
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 21) return
        setCommunityName(e.target.value)
        setCommunityCode(e.target.value.replaceAll(" ", "-").toLowerCase())
        SetCharsRemaining(21 - e.target.value.length)
    }

    const handleCreate = () => {
        setError("")
        const format = /[`!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;
        if (format.test(communityName)){
            setError("Special Characters not Allowed in Name.")
            return
        }

        createCommunity(sb,{
            name: communityName,
            code: communityCode,
            created_by: user?user.id:"",
            description:"This is a new Community"
        }).then((v)=>{
            if (v.status===201){
                // join the community as admin
                joinCommunity(sb,communityCode,user?.id||"","admin")?.then(v=>{
                    console.log("joined community",v)
                })

                handleClose()
                setCommunityName("")
                setCommunityCode("")
                SetCharsRemaining(21)

            }
            if (v.error!==null){
                setError(v.error.details)
            }
        })
    }

    return (
        <>
            <Modal isOpen={open} onClose={handleClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display="flex"
                        flexDirection="column"
                        fontSize={15}
                        padding={3}
                    >Create Community</ModalHeader>
                    <Box pl={3} pr={3}>
                        <ModalCloseButton />
                        <ModalBody
                            display="flex"
                            flexDirection="column"
                            padding="10px 0px"
                        >
                            <Text fontWeight={600} fontSize={15}>
                                Name
                            </Text>
                            <Text fontSize={11} color="gray.500">
                                Community name is case sensitive
                            </Text>

                            <Input value={communityName} onChange={handleChange} mt={1} mb={1} />
                            <Text fontSize="9pt" color={charsRemaining === 0 ? 'red' : 'gray.500'}>{charsRemaining} Characters Remaining</Text>

                            <Text fontWeight={600} fontSize={15} mt={5}>
                                Code
                            </Text>
                            <Text fontSize={11} color="gray.500">
                                Community code for your community
                            </Text>

                            <InputGroup>
                                <InputLeftAddon children='r/' bg="white" color="gray.300" borderColor="gray.100"/>
                                <Input value={communityCode} disabled />
                            </InputGroup>
                        </ModalBody>
                    </Box>
                    <ModalFooter bg="gray.100" borderRadius="0 0 10px 10px">
                        <Text color="red" fontSize="10pt" m={3}>
                            {error}
                        </Text>

                        <Button variant='outline' mr={3} height="30px" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button height="30px" onClick={handleCreate}>Create Community</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
export default CreateCommunity;