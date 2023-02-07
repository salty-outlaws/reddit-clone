import { authModalState } from '@/atoms/authModalAtom';
import { Input, Button, Flex, Text } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { sign } from 'crypto';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';

const SignUp:React.FC = () => {
    const setAuthModalState = useSetRecoilState(authModalState)
    const [signupForm, setSignupForm] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = useState('')
    const [isLoading,setIsLoading] = useState(false)
    const sb = useSupabaseClient()
    const handleClose = () => {
        setAuthModalState((prev) => ({
            ...prev,
            open: false
        }))
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        setIsLoading(true)
        setError('')

        if (signupForm.password !== signupForm.confirmPassword){
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }
       
        sb.auth.admin.createUser({
            email: signupForm.email,
            password: signupForm.password,
            email_confirm: true
        }).then((v)=>{            
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
        setSignupForm(prev => ({
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
                bg="gray.50"
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
                bg="gray.50"
            />
            <Input
                required
                name="confirmPassword"
                placeholder="confirm password"
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
                bg="gray.50"
            />

            {error && <Text color="red" fontSize="10pt">Error: {error}</Text>}

            <Button type='submit' width="100%" height="36px" mt={2} mb={2} isLoading={isLoading}>
                Sign Up
            </Button>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>Already a redditor?</Text>
                <Text color="blue.500" fontWeight={700} cursor="pointer"
                    onClick={() => {
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: "login"
                        }))
                    }}>Login</Text>
            </Flex>
        </form>
    )
}
export default SignUp;