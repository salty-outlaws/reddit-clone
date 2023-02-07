import { Button, Flex, Icon, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { IoArrowUpCircleSharp, IoArrowUpCircleOutline, IoArrowDownCircleSharp, IoArrowDownCircleOutline } from 'react-icons/io5';
import { HiOutlineChatBubbleLeft } from "react-icons/hi2"
import { AiOutlineDelete } from "react-icons/ai";
import AddComment from './AddComment';
import { User, useSupabaseClient } from '@supabase/auth-helpers-react';
import { BiUpvote } from 'react-icons/bi';
import { deleteComment } from '@/supabase/comments';
type CommentActionsProps = {
    user: User | null
    postID: string
    commentID: number
    path: number[]
    onCommentUpdated: () => void
};

const CommentActions: React.FC<CommentActionsProps> = ({
    user, postID, commentID, path, onCommentUpdated }) => {

    // == actions ==
    // upvote 
    // downvote  
    // delete
    const sb = useSupabaseClient()

    const [showReply, setShowReply] = useState(false)
    const hasUserVoted = () => 0

    const commentUpdatedCallback = () => {
        onCommentUpdated()
        setTimeout(()=>setShowReply(false),300)
    }

    const removeComment = () => {
        deleteComment(sb,commentID).then(v=>{
            onCommentUpdated()
        })
    }

    return (
        <Flex direction="column" onClick={e => e.stopPropagation()}>
            <Flex
                direction="row"
                align="center"
                height="40px"
            >
                <Icon
                    as={
                        hasUserVoted() === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
                    }
                    color={hasUserVoted() === 1 ? "brand.100" : "gray.400"}
                    fontSize={22}
                    cursor="pointer"
                    onClick={(e) => { }}
                    ml={2}
                />
                <Text fontSize="9pt" fontWeight={600}
                    ml={2}
                    mr={2}
                >
                    {0}
                </Text>
                <Icon
                    as={
                        hasUserVoted() === -1
                            ? IoArrowDownCircleSharp
                            : IoArrowDownCircleOutline
                    }
                    color={hasUserVoted() === -1 ? "#4379FF" : "gray.400"}
                    fontSize={22}
                    cursor="pointer"
                    mr={2}
                    onClick={(e) => { }}
                />
                <Button variant="ghost"
                    pr={2}
                    pl={1}
                    borderRadius={5}
                    height="28px"
                    onClick={() => setShowReply(!showReply)}
                >
                    <Flex direction="row" align="center">
                        <Icon mr={1} fontSize={18} as={HiOutlineChatBubbleLeft} />
                        <Text fontSize="9pt">Reply</Text>
                    </Flex>
                </Button>
                <Button variant="ghost"
                    pr={2}
                    pl={1}
                    borderRadius={5}
                    height="28px"
                    onClick={removeComment}
                >
                    <Flex direction="row" align="center">
                        <Icon mr={1} fontSize={18} as={AiOutlineDelete} />
                        <Text fontSize="9pt">Delete</Text>
                    </Flex>
                </Button>
            </Flex>
            {showReply && <Flex>
                <AddComment
                    onCommentUpdated={commentUpdatedCallback}
                    user={user}
                    isTopLevel={false}
                    postID={postID}
                    path={[...path, commentID]}
                    replyOf={commentID}
                />
            </Flex>}
        </Flex>
    )
}
export default CommentActions;