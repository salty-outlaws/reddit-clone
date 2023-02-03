import { SearchIcon } from '@chakra-ui/icons';
import { border, Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import React from 'react';

type SearchInputProps = {
    // user:
};

const SearchInput: React.FC<SearchInputProps> = () => {

    return (
        <Flex flexGrow={1} ml={2} mr={2} align="center">
            <InputGroup>
                <InputLeftElement
                    pointerEvents='none'
                    children={<SearchIcon color='gray.300' mb={1}/>}
                />
                <Input placeholder='Search Reddit' fontSize="10pt" 
                _placeholder={{ color: "gray.500" }} 
                style={{
                    borderRadius:"20px"
                }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                _focus={{
                    outline: "none",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                height="34px"
                bg="gray.50"
                />
            </InputGroup>
        </Flex>
    )
}
export default SearchInput;