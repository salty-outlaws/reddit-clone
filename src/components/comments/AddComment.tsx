import { addComment } from '@/supabase/comments';
import { Button, Flex, Textarea, Text } from '@chakra-ui/react';
import { SupabaseClient, User, useSupabaseClient } from '@supabase/auth-helpers-react';
import React, { useState } from 'react';

type AddCommentProps = {
    user: User | null
    replyOf?: number
    isTopLevel: boolean
    path?: number[]
    postID: string
    onCommentUpdated: () => void
};

const AddComment: React.FC<AddCommentProps> = ({
    user,
    replyOf,
    isTopLevel,
    path,
    postID,
    onCommentUpdated
}) => {

    const [body, setBody] = useState('')
    const sb = useSupabaseClient()
    const createComment = () => {
        const commentInput = {
            u_id: user?.id,
            u_name: user?.email!.split("@")[0],
            post_id: postID,
            body: body,
            path: path?.join("."),
            reply_of: replyOf,
            isTopLevel: isTopLevel
        }
        addComment(sb, commentInput).then(v => {
            console.log("add comment response:", v)
            onCommentUpdated()
        })
        setBody("")
    }

    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBody(event.target.value)
    }

    return (
        <Flex direction="column" p={4} width="100%" onClick={e => e.stopPropagation()}>
            <Textarea
                height="130px"
                fontSize="10pt"
                placeholder='What are your thoughts?'
                value={body}
                onChange={handleTextareaChange}
            />
            <Flex
                bg="gray.100"
                justifyContent="space-between"
                p={1}
                align="center"
            >
                <Text fontSize="9pt" fontWeight={700} ml={4}>
                    Markdown
                </Text>
                <Button height="28px" onClick={createComment}>Comment</Button>
            </Flex>
        </Flex>
    )
}
export default AddComment;