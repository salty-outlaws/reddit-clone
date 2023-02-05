import PageContent from '@/components/layout/PageContent';
import NewPostForm from '@/components/posts/NewPostForm';
import { Box, Text } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import React from 'react';

const SubmitPostPage:React.FC = () => {
    const user = useUser()
    return (
        <PageContent>
            <>
                <Box padding="14px 0px" borderBottom="1px solid" borderColor="white">
                    <Text>Create Post</Text>
                </Box>
                {user && <NewPostForm user={user}/>}
            </>
            <></>
        </PageContent>
    )
}
export default SubmitPostPage;