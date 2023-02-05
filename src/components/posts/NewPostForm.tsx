import { Flex, Icon } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { BsLink45Deg } from 'react-icons/bs';
import { BiPoll } from 'react-icons/bi';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import { Post } from '@/atoms/postsAtom';
import { User, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { createPost, uploadPostImage } from '@/supabase/post';
import { randomUUID } from 'crypto';
import uuid from 'uuid-random'
import { it } from 'node:test';

type NewPostFormProps = {
    user: User
};

const formTabs: TabItemType[] = [
    {
        title: 'Post',
        icon: IoDocumentText
    },
    {
        title: 'Image & Video',
        icon: IoImageOutline
    },
    {
        title: 'Link',
        icon: BsLink45Deg
    },
    {
        title: 'Poll',
        icon: BiPoll
    }
]

export type TabItemType = {
    title: string,
    icon: typeof Icon.arguments
}

const NewPostForm: React.FC<NewPostFormProps> = ({ user }) => {
    const router = useRouter()
    const sb = useSupabaseClient()
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
    const [textInputs, setTextInputs] = useState({
        title: "", body: ""
    })
    const [selectedFile, setSelectedFile] = useState<string>()
    const [imageFile, setImageFile] = useState<File>()

    const [loading, setLoading] = useState(false)

    const handleCreatePost = () => {
        setLoading(true)
        const { communityId } = router.query
        const newPost: Post = {
            id: uuid(),
            u_id: user.id,
            u_name: user.email!.split("@")[0],
            c_code: communityId as string,
            title: textInputs.title,
            body: textInputs.body,
        }

        if (imageFile) {
            uploadPostImage(sb, newPost.id, imageFile).then(v => {
                newPost.imageURL = v.data?.path
                if (!v.error){
                    createPost(sb, newPost).then(v => {
                        if (v.error) {
                            console.log(v.error)
                            return
                        }
                        router.back()
                    })
                }
            })
        } else {
            createPost(sb, newPost).then(v => {
                if (v.error) {
                    console.log(v.error)
                    return
                }
                router.back()
            })
        }
        setLoading(false)
    }

    const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader()
        if (e.target.files?.[0]) {
            setImageFile(e.target.files[0])
            reader.readAsDataURL(e.target.files[0])
        }

        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedFile(readerEvent.target.result as string)
            }
        }
    }

    const onTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { target: { name, value } } = e
        setTextInputs((p) => ({
            ...p,
            [name]: value
        }))
    }

    return (
        <Flex direction="column" bg="white" borderRadius={4} mt={2}>
            <Flex width="100%">
                {formTabs.map(item => (
                    <TabItem key={item.title} item={item} selected={item.title === selectedTab} setSelectedTab={setSelectedTab} />
                ))}
            </Flex>
            <Flex p={4}>
                {selectedTab === "Post" && <TextInputs
                    textInputs={textInputs}
                    handleCreatePost={handleCreatePost}
                    onChange={onTextChange}
                    loading={loading}
                />}
                {selectedTab === "Image & Video" &&
                    <ImageUpload
                        selectedFile={selectedFile} setSelectedFile={setSelectedFile}
                        setSelectedTab={setSelectedTab} onSelectImage={onSelectImage} />}
            </Flex>
        </Flex>
    )
}
export default NewPostForm;