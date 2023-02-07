import { Box, Button, Collapse, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import moment from 'moment';
import React, { useState } from 'react';
import { FaRedditSquare } from 'react-icons/fa';
import { Comment } from "../../atoms/commentAtom"
import CommentActions from './CommentActions';
import CommentsList from './CommentsList';
import ReactMarkdown from 'react-markdown'
import { User } from '@supabase/auth-helpers-react';
import { BiBorderRadius } from 'react-icons/bi';



type CommentItemProps = {
    comment: Comment
    user: User | null
    postID: string
    path: number[]
    onCommentUpdated: () => void
}

export const CommentItem: React.FC<CommentItemProps> = ({
    comment, user, postID, path, onCommentUpdated }) => {

    const [showChildren, setShowChildren] = useState(true)

    const loadSubComments = () => {
        // reply_of - comment.id
        // post - comment.post_id
    }

    const childToggler = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        setShowChildren(!showChildren)
    }

    return (
        <Flex direction="column">
            <Flex direction="row" align="center">
                <Icon fontSize="24" mr={1} color="gray.300" as={FaRedditSquare} />
                <Text fontWeight={700} fontSize="10pt">{comment.u_name}</Text>
                <Text ml={4} fontSize="8pt" color="gray.500">{moment(new Date(comment.created_at)).fromNow()}</Text>
            </Flex>
            <Flex direction="column"
                id="comment"
                onClick={childToggler}
                mt={2}
                ml={2.5}
                borderLeft={"2px solid"}
                borderLeftColor={showChildren ? "gray.200" : "blue.500"}
            >

                <Flex direction="column"
                    fontSize="11pt"
                >
                    <Flex
                        ml={3}
                        listStylePosition="inside"
                        direction="column"
                    >
                        {comment.is_deleted && <Text>[DELETED]</Text>}
                        {!comment.is_deleted && <ReactMarkdown>{comment.body}</ReactMarkdown>}
                    </Flex>
                    <CommentActions
                        onCommentUpdated={onCommentUpdated}
                        user={user}
                        postID={postID}
                        commentID={comment.id}
                        path={path}
                        isCommentByUser={user?.id===comment.u_id}
                    />
                </Flex>
                {comment.children && comment.children.length == 0 && comment.replies_count > 0 &&
                    <Text
                        color="blue.500"
                        onClick={() => loadSubComments()}
                    >{comment.replies_count} more replies</Text>}

                {showChildren && comment.children && comment.children.length > 0 &&
                    <Flex>
                        <CommentsList
                            onCommentUpdated={onCommentUpdated}
                            hideAddComment={true}
                            comments={comment.children}
                            postID={postID}
                            path={[...path, comment.id]}
                        />
                    </Flex>
                }

            </Flex>
        </Flex>
    )
}

export default CommentItem;