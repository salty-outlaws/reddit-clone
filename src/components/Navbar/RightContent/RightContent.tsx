import AuthModal from '@/components/Modal/Auth/AuthModal';
import { Button, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import AuthButtons from './AuthButtons';
import { User, useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Icons from './Icons';
import UserMenu from './UserMenu';

type RightContentProps = {
    user?: User|null
}

const RightContent:React.FC<RightContentProps> = ({user}) => {
    const session = useSession()

    return (
        <>
        <AuthModal/>
        {/* <Button onClick={createComm}>Create Community</Button> */}
        <Flex justify="center" align="center">
            {session?
            <Flex align="center">
                {/* <Text  ml={2} mr={2}>{user?.email}</Text><Button onClick={signOut}>Logout</Button> */}
                <Icons/>
                <UserMenu user={user}/>
            </Flex>
            :<AuthButtons/>}
        </Flex>
        </>
    )
}
export default RightContent;