import mongoose from "mongoose";

import PostMessages from "../models/postmessages.js";



export const getPosts = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 3;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await PostMessages.countDocuments({});
        const posts = await PostMessages.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;
  
    try {
        const post = await PostMessages.findById(id);
        
        res.status(200).json(post);
       
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

 export const getPostBySearch=async(req,res)=>{
           const {searchQuery,tags}=req.query;

          try {
               const title=new RegExp(searchQuery,'i');
               const posts=await PostMessages.find({$or:[{title},{tags:{$in:tags.split(',')}}]})
               res.json({data:posts});
           } catch (error) {
            res.json(404).json({message:error.message})
           }
 }

export const createPost = async (req, res) => {
     
    const post = req.body;
const newPost = new PostMessages({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
  
    try {
        await newPost.save();
        
        res.status(201).json(newPost);
      
      
    } catch (err) {
        res.status(409).json(err)
       
    }
}


export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;
   

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post with id: ${_id}`);

    const updatedPost = await PostMessages.findByIdAndUpdate(_id, { ...post, _id }, { new: true });
    

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    await PostMessages.findByIdAndRemove(id);
    res.json({ message: "Post deleted successfully" });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessages.findById(id);

    const index = post.likes.findIndex((id) => id ===String(req.userId));
    
    if (index === -1) {
      post.likes.push(req.userId);
     
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessages.findByIdAndUpdate(id, post, { new: true });
    // console.log(updatedPost);
    // console.log("liked");
    
    res.status(200).json(updatedPost);
}
                                                                                                                                                                                             