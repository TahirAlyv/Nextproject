import { use, useState } from "react"

export default function Comment({movieId}) 
{
    const [comment,setComment]=useState('');
    const [rating,setRating]=useState(0)

      const handleClick = (num) => {
      if (rating === num) {
       setRating(0);  
     } else {
       setRating(num);
     }
    };
 

    const handleChange = (e)=> {
        setComment(e.target.value)
    }

   const handleSubmit = (e) => {

    e.preventDefault();
    if (comment.trim() === '') {
        alert("Please write a comment.");
        return;
    }

    async function fetchComment() {
        const res = await fetch('/api/review', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment, rating, movieId })
        });

        if (res.ok) {
            console.log("Result is okay", res.ok);
            setRating(0);
            setComment('');
        }
    }

    fetchComment();
}


    return (
        
    <div className="flex flex-col mt-20 gap-6 items-center">

                    <div className="flex gap-1 items-col items-center">
                      <span className="text-1xl font-semibold text-gray-700">Rate the movie | </span>
                        {[1, 2, 3, 4, 5].map((num) => (
                    <span
                         key={num}
                         onClick={() => handleClick(num)}
                         className={`cursor-pointer text-3xl ${
                         num <= rating ? 'text-yellow-400' : 'text-gray-400'
                         }`}
                        >
                       {num <= rating ? '★' : '☆'}

                    </span>
                ))}
            </div>

            <form className="flex flex-col items-end" method="POST">
                   <textarea placeholder="Comment.." className="bg-white w-150 h-35 border-2 rounded-md pl-[10px]" type="text" value={comment} onChange={handleChange}/>
                   <button type="submit" className=" cursor-pointer bg-green-500 rounded-md h-10 w-20 mt-5 text-white " onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    )


}
