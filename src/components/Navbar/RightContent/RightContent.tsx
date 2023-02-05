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
        <Flex justify="center" align="center">
            {session?
            <Flex align="center">
                <Icons/>
                <UserMenu user={user}/>
            </Flex>
            :<AuthButtons/>}
        </Flex>
        </>
    )
}
export default RightContent;