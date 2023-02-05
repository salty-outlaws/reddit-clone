import { Flex } from '@chakra-ui/react';
import React from 'react';

type PageContentProps = {
    children: React.ReactNode
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {

    return (
        <Flex justify="center" p="16px" >
            <Flex justify="center" width="95%" maxWidth="860px">
                <Flex
                    direction="column"
                    width={{base:"100%", md:"65%"}}
                    mr={{base:0, md:6}}
                >
                    {children && children[0 as keyof typeof children]}
                </Flex>
                <Flex
                    direction="column"
                    display={{base:"none", md:"flex"}}
                    flexGrow={1}
                >
                    {children && children[1 as keyof typeof children]}
                </Flex>
            </Flex>
        </Flex>
    )
}
export default PageContent;