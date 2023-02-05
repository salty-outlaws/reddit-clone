import { Community } from '@/atoms/communityAtom';
import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { FaReddit } from 'react-icons/fa';
import useCommunityData from "../../hooks/useCommunityData"

type HeaderProps = {
    community: Community
};

const Header: React.FC<HeaderProps> = ({ community }) => {

    const {communities, onJoinOrLeaveCommunity, loading} = useCommunityData()
    const isJoined = !!communities.find(item=> item===community.code)

    return (
        <Flex direction="column" width="100%" height="146px">
            <Box height="50%" bg="blue.400" />
            <Flex justify="center" bg="white" flexGrow={1}>
                <Flex
                    width="95%" maxWidth="860px" 
                >
                    <Icon as={FaReddit}
                        fontSize={64}
                        position="relative"
                        top={-3}
                        color="blue.500"
                        border="4px solid white"
                        borderRadius="50%"
                    />
                    <Flex padding="10px 16px">
                        <Flex direction="column" mr={6}>
                            <Text fontWeight={800} fontSize="16pt">
                                {community.name}
                            </Text>
                            <Text fontWeight={600} fontSize="10pt" color="gray.400">
                                r/{community.code}
                            </Text>
                        </Flex>
                        <Button variant={isJoined ? 'outline' : 'solid'}
                            height="30px"
                            pr={6}
                            pl={6}
                            isLoading={loading}
                            onClick={() => onJoinOrLeaveCommunity(community.code, isJoined)}
                        >{isJoined ? 'leave' : 'join'}</Button>
                    </Flex>

                </Flex>
            </Flex>
        </Flex>
    )
}
export default Header;