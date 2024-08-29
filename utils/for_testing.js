var _ = require("lodash")

const total_likes = (blogs) =>
{
    const reducer = (sum, blog) => sum + blog.likes
    return blogs.reduce(reducer, 0)
}

const most_liked = (blogs) =>
{
    const reducer = (max_blog, curr_blog) =>
    {
        if(max_blog.likes>curr_blog.likes)
            return max_blog
        else
            return curr_blog
    }

    return blogs.reduce(reducer, {})
}

const most_blogs_author = (blogs) =>
{
    if(blogs.length == 0)
        return {}
    
    const grouped = _(blogs)
        .groupBy("author")
        .map((element, key)=>({
                Author: key,
                Count : _(element).size()
            }))
        .orderBy('Count','desc')
        .value()
    console.log(grouped)
    return grouped[0]
}

const most_liked_author = (blogs) =>
    {
        if(blogs.length == 0)
            return {}
        
        const grouped = _(blogs)
            .groupBy("author")
            .map((element, key)=>({
                    Author: key,
                    Likes : _(element)
                                .reduce((sum, element) => sum + element.likes, 0)
                }))
            .orderBy('Likes','desc')
            .value()

        console.log(grouped)
        return grouped[0]
    }




module.exports = {total_likes, most_liked, most_blogs_author, most_liked_author}