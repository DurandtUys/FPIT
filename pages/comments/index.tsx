import { useState } from "react";

function commentsPage()
{
    const [comments,setComments] = useState([]);

    const fetchComments = async() =>
    {
        const response = await fetch('/api/comments');
        const data = await response.json();
        setComments(data);
    }
    return(
        <div>
            <button onClick={fetchComments}>get comments</button>
            {comments.map((comment) =>{
                return(
                    <div>
                        {comment.id}
                    </div>
                )
            })}
        </div>
    )
}

export default commentsPage