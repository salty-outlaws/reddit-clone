import { AuthModalState, authModalState } from '@/atoms/authModalAtom';
// import { currentUserState } from '@/atoms/currentUserState';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import { m } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useSupabaseClient } from '@supabase/auth-helpers-react'

type LoginProps = {

};

const Login: React.FC<LoginProps> = () => {
    const [error, setError] = useState('')
    const [isLoading,setIsLoading] = useState(false)
    const setAuthModalState = useSetRecoilState(authModalState)
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    })
    const sb = useSupabaseClient()

    const handleClose = () => {
        setAuthModalState((prev: AuthModalState) => ({
            ...prev,
            open: false,
        }))
    }

    // firebase logic
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        setIsLoading(true)
        setError('')
        
        sb.auth.signInWithPassword({
            email: loginForm.email,
            password: loginForm.password
        }).then((v)=>{
            console.log(v)
            if (v.data.user !== null){
                handleClose()
            }else if (v.error?.message !== ""){
                setError(JSON.stringify(v.error?.message))
            }
        }).catch((e)=>{
            setError(JSON.stringify(e))
        }).finally(()=>{
            setIsLoading(false)
        })
    }
     
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    return (
        <form onSubmit={onSubmit}>
            <Input
                required
                name="email"
                placeholder="email"
                type="email"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
            />
            <Input
                required
                name="password"
                placeholder="password"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
            />

            {error && <Text color="red" fontSize="10pt">Error: {error}</Text>}

            <Button type='submit' width="100%" height="36px" mt={2} mb={2} isLoading={isLoading}>
                Log In
            </Button>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>New Here?</Text>
                <Text color="blue.500" fontWeight={700} cursor="pointer"
                    onClick={() => {
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: "signup"
                        }))
                    }}>SignUp</Text>
            </Flex>
        </form>
    )
}
export default Login;