import { Community } from '@/atoms/communityAtom';
import useCommunityData from '@/hooks/useCommunityData';
import { listCommunities } from '@/supabase/community';
import { Flex,Text,Button, Icon, Divider, Stack, StackDivider } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useUnmountEffect } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaReddit } from 'react-icons/fa';

type HomeSidebarProps = {
    
};

const HomeSidebar:React.FC<HomeSidebarProps> = () => {
    const {communities,onJoinOrLeaveCommunity} = useCommunityData()
    const user = useUser()
    const sb = useSupabaseClient()
    const [allCommunities,setAllCommunities] = useState<string[]>()
    const router = useRouter()

    useEffect(()=>{
        if (!allCommunities && user){
            listCommunities(sb,0).then(v=>{
                setAllCommunities(v.data?.map(c=>c.code))
            })
        }
    })

    const isJoined = (communityCode: string) => {
        return communities.find(e => e === communityCode)
    }

    return (
        <Stack
            maxWidth="277px"
        >
            
        <Flex 
            bg="white"
            border="1px solid"
            borderColor="gray.300"
            borderRadius={6}
            width="100%"
            direction="column" 
            p={4}
            maxWidth="277px"
        >
            <Flex direction="row" align="center" mb={3}>
                <Icon fontSize={40} as={FaReddit} mr={6}/>
                <Text fontWeight={700}>Home</Text>
            </Flex>
            <Text mb={2}>
                Your personal Reddit frontpage. 
                Come here to check in with your favorite communities.
            </Text>
            <Divider/>
            {!user && <Button variant="outline" mt={3}>Login / Signup</Button>}
            <Button mt={3}>Create Community</Button>
        </Flex>
        
        <Flex 
            bg="white"
            border="1px solid"
            borderColor="gray.300"
            borderRadius={6}
            width="100%"
            direction="column" 
            p={4}
            
        >
            <Text fontWeight={700} mb={4}>Explore Communities</Text>
            <Stack spacing={0} divider={<StackDivider/>}>
                {allCommunities && allCommunities.map(c=>(
                <Flex
                    key={c}
                    p={2}
                    cursor="pointer"
                    _hover={{
                        bg:"gray.100"
                    }}
                    onClick={()=>{router.push("/r/"+c)}}
                    justifyContent="space-between"
                >{c}
                {!isJoined(c) && 
                <Button 
                    variant="outline" height="28px"
                    _hover={{
                        bg:"blue.100"
                    }}
                    onClick={(e)=>{e.stopPropagation();onJoinOrLeaveCommunity(c, false)}}
                >Join</Button>}
                {isJoined(c) && 
                <Button 
                    variant="outline" height="28px"
                    _hover={{
                        bg:"blue.100"
                    }}
                    onClick={(e)=>{e.stopPropagation();onJoinOrLeaveCommunity(c, true)}}
                >Leave</Button>}
                </Flex>
                ))}
            </Stack>
        </Flex>
        </Stack>
    )
}
export default HomeSidebar;