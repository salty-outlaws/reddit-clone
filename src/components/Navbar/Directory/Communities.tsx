import CreateCommunity from '@/components/Modal/Community/CreateCommunity';
import useCommunityData from '@/hooks/useCommunityData';
import { getUserCommunities } from '@/supabase/community';
import { Flex, Icon, MenuDivider, MenuItem } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { GrAdd } from 'react-icons/gr'
type CommunitiesProps = {
};

const Communities: React.FC<CommunitiesProps> = ({ }) => {
    const defaultCommunity: { c_code: string }[] = []
    const [open, setOpen] = useState(false)

    const sb = useSupabaseClient()
    const user = useUser()

    const {communities} = useCommunityData()

    return (
        <>
            <CreateCommunity open={open} handleClose={() => setOpen(false)} />
            <MenuItem width="100%" fontSize="10pt"
                _hover={{ bg: "gray.100" }}
                onClick={() => setOpen(true)}
            >
                <Flex align="center">
                    <Icon fontSize={20} mr={2} as={GrAdd} />
                    Create Community
                </Flex>
            </MenuItem>
            <MenuDivider />

            {communities.map((e) => (
                <Link key={e} href={"/r/" + e}>
                <MenuItem width="100%" fontSize="10pt"
                    _hover={{ bg: "gray.100" }}
                >
                    <Flex align="center">
                        {e}
                    </Flex>
                    
                </MenuItem>
                </Link>
                ))}
        </>
    )
}
export default Communities;