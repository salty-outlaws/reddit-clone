import { Flex, Button } from '@chakra-ui/react';
import React from 'react';

const OAuthButtons:React.FC = () => {
    
    return (
        <Flex direction="column" width="100%" mb={4}>
            <Button variant="oauth" mb={2}>Continue with Google</Button>
            <Button variant="oauth">Continue with Github</Button>
        </Flex>
    )
}
export default OAuthButtons;