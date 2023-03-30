import { AddIcon, CheckIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import { Box, Button, color, Flex, FormControl, FormErrorMessage, Image, Input, InputGroup, InputRightElement, Spinner, Text, useBoolean, useToast, VisuallyHiddenInput, VStack } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { useForm } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import { useLogin, useSignUp } from "@/hooks/useMutation"
import { useRouter } from "next/router"
import { IUser } from "types"

const signupSchema = z.object({
    name: z.string().min(2, {message: "Required"}),
    email: z.string().email().min(2, {message: "Required"}),
    password: z.string().min(2, {message: "Required"}),
    confirmPassword: z.string().min(2, {message: "Required"}),
    picture: z.string().nullable(),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ['confirmPassword']
      });
    }
  });

const loginSchema = z.object({
    email: z.string().email().min(2, {message: "Required"}),
    password: z.string().min(2, {message: "Required"}),
})

export const LoginForm = () => {

    const toast = useToast()
    const router = useRouter()
    const {
        register, 
        handleSubmit, 
        setValue,
        formState: {
            errors,
        }
    } = useForm({
        values: {
            email: "",
            password: "",
        },
        resolver: zodResolver(loginSchema)
    })

    const {
        mutate: login,
        isLoading
    } = useLogin({
        onSuccess: (data: IUser) => {
            toast({
                title: "Success",
                status: "success",
                description: "Login Successfull...",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            localStorage.setItem('iChat_user', JSON.stringify(data))
            router.push('/chat')
        },
        onError: (err) => {
            console.log(err);
            toast({
                title: "Error",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        }
    })

    const submit = (values) => {
        login({...values})
    }

    const [showPass, showPassSet] = useState(false)
    return (
        <form onSubmit={handleSubmit(submit)}>
            <VStack spacing={3}>
                <FormControl isInvalid={errors.email}>
                    <Input width={"100%"} placeholder='Email' type={"email"} {...register('email')} />
                    <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.password}>
                    <InputGroup>
                        <Input type={showPass ? "text" : "password"} placeholder='Password' {...register('password')} />
                        <InputRightElement width='3.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => showPassSet(prev => !prev)}>
                            {showPass ? 
                            <ViewOffIcon />
                            : 
                            <ViewIcon />
                            }
                        </Button>
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
                </FormControl>
                <Button isLoading={isLoading} type={"submit"} width={"full"}>Login</Button>
                <Button width={"full"} bg={"teal"} _hover={{bg: "teal", opacity: 0.8}}
                    onClick={() => {
                        setValue('email', 'guest@example.com', { shouldDirty: true, shouldValidate: true })
                        setValue('password', 'password', { shouldDirty: true, shouldValidate: true })
                    }}
                >Guest User</Button>
            </VStack>
        </form>
    )
}

export const SignUpForm = () => {
    const [showPass, setShowPass] = useBoolean()
    const imageRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const router = useRouter()

    const {
        register, 
        handleSubmit, 
        setValue,
        getValues,
        formState: {
            errors,
        }
    } = useForm({
        values: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            picture: "",
        },
        resolver: zodResolver(signupSchema)
    })
    const postDetails = (file) => {
        setLoading(true);
        if(file === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }

        if(file.type === 'image/jpeg' || file.type === 'image/png') {
            const data = new FormData()
            data.append('file', file);
            data.append('upload_preset', 'iChat-app')
            data.append('cloud_name', 'dzikwshsv')
            fetch('https://api.cloudinary.com/v1_1/dzikwshsv/image/upload', {
                method: "POST",
                body: data,
            }).then((res) => res.json())
            .then((data) => {
                setValue('picture', data.url.toString(), {shouldValidate: true, shouldDirty: true})
                setLoading(false)
            })
            .catch(err => {
                console.log(err);
                setLoading(false)
            })
        } else {
            toast({
                title: "Please Select either JPEG or PNG image type...",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return;
        }
    }

    const {
        mutate: signUp,
        isLoading
    } = useSignUp({
        onSuccess: (data) => {
            toast({
                title: "Success",
                status: "success",
                description: "Registration Successfull...",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            localStorage.setItem('iChat_user', JSON.stringify(data))
            router.push('/chat')
        },
        onError: (err) => {
            console.log(err);
            toast({
                title: "Error",
                description: "Some Error Occurred...",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        }
    })

    const submit = (values) => {
        const {confirmPassword, ...data} = values
        if(data.picture) {
            signUp({...data})
        }
        else {
            const {picture, ...rest} = data
            signUp({...rest})
        }
    }

    return (
        <form noValidate onSubmit={handleSubmit(submit)}>
            <VStack spacing={3} mt={4}>
                {loading ? (
                    <Spinner />
                ):
                getValues().picture && (
                    <Image src={getValues().picture} width={150} height={150} alt={""} borderRadius={"50%"} objectFit={"cover"} objectPosition={"top"} />
                )}
                <FormControl isInvalid={errors.name}>
                    <Input width={"full"} placeholder='Name' type={"text"} {...register('name')} />
                    <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.email}>
                    <Input width={"full"} placeholder='Email' type={"email"} {...register('email')} />
                    <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.password}>
                    <InputGroup>
                        <Input type={showPass ? "text" : "password"} placeholder='Password' {...register('password')} />
                        <InputRightElement width='3.5rem'>
                        <Button h='1.75rem' size='sm' onClick={setShowPass.toggle}>
                            {showPass ? 
                            <ViewOffIcon />
                            : 
                            <ViewIcon />
                        }
                        </Button>
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.confirmPassword}>
                    <InputGroup>
                        <Input type={showPass ? "text" : "password"} placeholder='Confirm Password' {...register('confirmPassword')} />
                        <InputRightElement width='3.5rem'>
                        <Button h='1.75rem' size='sm' onClick={setShowPass.toggle}>
                            {showPass ? 
                            <ViewOffIcon />
                            : 
                            <ViewIcon />
                        }
                        </Button>
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors?.confirmPassword?.message}</FormErrorMessage>
                </FormControl>
                <Flex align={"center"} gap={"10px"} border={"1px solid rgba(255,255,255,0.16)"} borderRadius={"5px"} width={"full"} p={"7px 10px"} cursor={"pointer"} onClick={() => imageRef.current.click()}>
                    {getValues().picture ? 
                        <CheckIcon color={'teal'} />
                        :
                        <AddIcon color={"whiteAlpha.400"}/>
                    }
                    <Text color={getValues().picture ? "teal" : "whiteAlpha.400"} textAlign={"start"} >Upload Profile Image</Text>
                </Flex>
                    <VisuallyHiddenInput type={"file"} ref={imageRef} accept={"image/*"} onChange={(e) => postDetails(e.target.files[0])} />
                <Button isLoading={isLoading} type="submit" width={"full"} bg={"teal"}>SignUp</Button>
            </VStack>
        </form>
    )
}