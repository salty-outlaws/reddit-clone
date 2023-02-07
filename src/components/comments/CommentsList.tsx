import { Stack, Flex, Text } from "@chakra-ui/react"
import { CommentItem } from "./CommentItem"
import { Comment } from "../../atoms/commentAtom"
import AddComment from "./AddComment"
import { useUser } from "@supabase/auth-helpers-react"

type CommentsListProps = {
    postID: string
    comments?: Comment[]
    path?: number[]
    hideAddComment: boolean
    onCommentUpdated: () => void
}

export const CommentsList: React.FC<CommentsListProps> = ({
    comments, postID, path, hideAddComment, onCommentUpdated }) => {
    // const comments = []
    const user = useUser()
    return (
        <Flex bg="white" p={2} direction="column" width="100%">
            {!hideAddComment && <AddComment
                user={user}
                isTopLevel={true}
                postID={postID}
                onCommentUpdated={onCommentUpdated}
            />}
            {!hideAddComment &&
                <Text fontSize="10pt" fontWeight={700} mb={4}>Sorted by: Latest</Text>
            }
            {comments && comments.map((comment) => (
                <CommentItem
                    onCommentUpdated={onCommentUpdated}
                    key={comment.id}
                    comment={comment}
                    user={user}
                    postID={postID}
                    path={comment.isTopLevel ? [] : path as number[]}
                />
            ))}
        </Flex>
    )
}
export default CommentsList;