import { Flex } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import React from 'react';
import Directory from './Directory/Directory';
import RightContent from './RightContent/RightContent';
import SearchInput from './SearchInput';


const Navbar:React.FC = () => {
    const user = useUser()
    return (
        <Flex bg="white" height='44px' padding="6px 12px"
            justify={{md:"space-between"}}
        >
            <Flex align="center"
                width={{base:"40px", md:"auto"}}
                mr={{base:2, md:2}}
            >
                <Link href="/"><b>Reddit</b></Link>
            </Flex>
            {user&&<Directory/>}
            <SearchInput user={user}/>
            <RightContent user={user}/>
        </Flex>
    )
}
export default Navbar;