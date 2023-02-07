import { Flex, Icon, Text } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import React from 'react';
import { FaReddit } from 'react-icons/fa';
import Directory from './Directory/Directory';
import RightContent from './RightContent/RightContent';
import SearchInput from './SearchInput';


const Navbar: React.FC = () => {
    const user = useUser()
    return (
        <Flex bg="white" height='44px' padding="6px 12px"
            justify={{ md: "space-between" }}
        >
            <Flex align="center"
                width={{ base: "40px", md: "auto" }}
                mr={{ base: 2, md: 2 }}
            >
                <Link href="/">
                    <Flex align="center">

                        <Icon mr={2} color="brand.100" fontSize={28} as={FaReddit} />
                        <Text
                            fontWeight={700}
                            display={{ base: 'none', md: 'flex' }}
                        >Reddit</Text>
                    </Flex>
                </Link>
            </Flex>
            {user && <Directory />}
            <SearchInput user={user} />
            <RightContent user={user} />
        </Flex>
    )
}
export default Navbar;