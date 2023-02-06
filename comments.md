### Summary
Comments will have an hierarchy which makes it tough to model in a sql db.
Main questions are - 
- How do we store comments
- How do we retrieve comments 
- How do we delete comments
- How do we render comments in UI

#### In the UI Comments can be arranged in a few ways - 
- top (most voted)
- new
- old
- controversial (least voted)

### Constraint
Comments which have top votes, which were created last can be at any level (not just top level). When loading those comments, we first get the ordered comments based on arrangement, the parents of those comments must also be loaded. i.e
a comment when loaded should also load its parents all the way to the top level so that it can be rendered. To achieve this we can store the comment path in each of the comment record.
ex - 
```js
6 path 1,2,3
9 path 1,2
22 path 4,5
```

In the above example when loading comments 6,9,22 we also need to load [1,2,3] union [1,2] union [4,5] = [1,2,3,4,5]

### Adding Comment
When adding a new comment we need to know if that comment is at top level or is a reply of another comment. This info can be stored in form of two columns `isTopLevel` and `reply_of`. Additionally, we need to store the entire path to the respective top level comment in a `path` field.

#### When adding top level comment 
- `path=[]` , `isTopLevel=true` and `reply_of=null`
- All the above would be known while calling the API

#### When adding a leaf comment 
- `path=[p1,p2]`, `isTopLevel=false` and `reply_of=p1`
- We would already know from the API call which comment we are replying to and if the comment is a top level comment. 
- To get the path - we need to get the p1 record's path field and append p1 to the beginning.
- Using the path - we do a bulk update of replies_count+1 for each item in path.


### Getting Comments
Steps for first load-
- for given post id, find the arrangement (top,new etc)
- using the arrangement - make an api call to get first N comments (of any level)
- make another api call retrieving the combined list of parents of the above N comments

### Steps for next load-
- when user clicks on loadReplies for a given comment(comment_id) - load the comments which have reply_of as comment_id

### How to find if a comment has replies and how many-
- Whenever we add a new comment - we have the full path for that comment
- We can do a bulk update to a `replies_count` field adding 1 to each of the comment in the `path`

### Deleting Comment
- To keep things simple, when deleting comment - we just mark a field is_deleted=true
- This will preserve the comment hierarchy below and above.
- The UI can choose to render it as a deleted comment.


### Rendering Comments
When we get the response from APIs - we will have two lists
- comments from first API call which are arranged
- parent comments for the above list
- We can use JSON path lib to add entries to an object based on the path field.
ex - 
```js
	6 path 1,2,3
	9 path 1,2
	22 path 4,5

jsonPath.add(commentTree, "1.children.2.children.3.children",{id:6, body:"something"})
jsonPath.add(commentTree, "1.children.2.children",{id:9, body:"something"})
jsonPath.add(commentTree, "4.children.5.children",{id:22, body:"something"})

Resulting structure
1:
	children:
		2:
			children:
				3:
					children:
						6: val
				9: val
4:
	children:
		5: val

```
This resulting structure can then be rendered recursively using a `comment` and `replies` component
```
<comment
	body={c.body}
	timestamp={c.timestamp}
	...
	 // If children = [] and replies_count > 0 then comments need to be loaded
	{c.children.length==0 && c.replies_count>0 ? && <RepliesLoader c={commentID}/>}
	// if children present - then render replies
	{c.children.length>0 ? && <Replies comments={c.children}/>}		 
>
```

#### Typescript Type Config for Comment
```ts
type Comment = {
    body: string
    children: Comment[]
}

  

const commentsList: Comment[] = [
    {
        body: "top comment",
        children: [
            {
                body: "sub comment1",
                children: []
            },
            {
                body: "sub comment2",
                children: [
                    {
                        body: "sub sub comment1",
                        children:[]
                    }
                ]
            }
        ]
    }
]
```