import { Community } from '@/atoms/communityAtom';
import { Stack, Flex, Text, Editable, EditablePreview, EditableTextarea } from '@chakra-ui/react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

type CommunitySidebarProps = {
    community: Community
};

const CommunitySidebar: React.FC<CommunitySidebarProps> = ({ community }) => {
    
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
                <Text fontWeight={700} mb={2}>About Community</Text>
                <Text fontSize="10pt">{moment(new Date(community.created_at || "")).fromNow()}</Text>
                <Text mt={3}>{community.description}</Text>
            </Flex>
        </Stack>
    )

    // about community
    // rules
    // moderators
}
export default CommunitySidebar;