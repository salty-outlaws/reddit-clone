import AuthModal from '@/components/Modal/Auth/AuthModal';
import { Button, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import AuthButtons from './AuthButtons';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

type RightContentProps = {
    // user: any
};

const RightContent:React.FC<RightContentProps> = ({}) => {
    const session = useSession()
    const user = useUser()
    const sb = useSupabaseClient()
    const signOut = () =>{
        sb.auth.signOut()
    }

    return (
        <>
        <AuthModal/>
        {/* <Button onClick={createComm}>Create Community</Button> */}
        <Flex justify="center" align="center">
            {session?
            <Flex align="center">
                <Text  ml={2} mr={2}>{user?.email}</Text><Button onClick={signOut}>Logout</Button>
            </Flex>
            :<AuthButtons/>}
        </Flex>
        </>
    )
}
export default RightContent;