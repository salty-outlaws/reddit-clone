import { selectedCommunity } from '@/atoms/communityAtom';
import { getUserCommunities } from '@/supabase/community';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Icon, Menu, MenuButton, MenuList,Text } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { TiHome } from "react-icons/ti";
import { useRecoilValue } from 'recoil';
import Communities from './Communities';

const UserMenu: React.FC = () => {
    const sb = useSupabaseClient()
    const user = useUser()
    const router = useRouter()
    const currCommunity = useRecoilValue(selectedCommunity)

    return (
        <Menu>
            <MenuButton cursor="pointer" padding="0px 6px"
                borderRadius={4}
                _hover={{
                    outline: "1px solid", outlineColor: "gray.200"
                }}
                ml={4}
            >
                <Flex align="center" justify="space-between"  width={{base:"auto", lg:"200px"}}>
                    <Flex align="center">
                        <Icon fontSize={24} as={TiHome} mr={{base:1, md:2}}/>
                            <Flex display={{base:"none", lg:"flex"}}>
                                <Text fontWeight={600} fontSize="10pt">
                                    {router.pathname === "/"?"Home":currCommunity}
                                </Text>
                            </Flex>
                    </Flex>
                        <ChevronDownIcon />
                </Flex>
            </MenuButton>
            <MenuList>
                <Communities/>
            </MenuList>
        </Menu>
    )
}
export default UserMenu;