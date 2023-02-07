export interface Comment {
    id: number
    body: string
    u_id: string
    u_name: string
    created_at: string
    post_id: string
    replies_count: number
    children: Comment[]
    isTopLevel: boolean
    reply_of: number
    is_deleted: boolean
}