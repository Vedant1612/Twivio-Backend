import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { content } = req.body
    const { videoId } = req.params

    if(!content){
        throw new ApiError(400, "Comment is required")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video Id")
    }

    const newComment = Comment.create(
        {
            content,
            video: videoId,
            owner: req.user?._id
        }
    )

    if(!newComment){
        throw new ApiError(400, "failed to add comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, newComment, "Comment added Successfully")
    )


})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }