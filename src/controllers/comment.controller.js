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

    const newComment = await Comment.create(
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
    const { content } = req.body
    const { commentId } = req.params

    if(!content){
        throw new ApiError(400, "Comment is required")
    }

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Comment Id")
    }

    const oldComment = await Comment.findById(commentId)

    if(!oldComment){
        throw new ApiError(400, "Comment not found")
    }

    if(oldComment?.owner.toString() != req.user?._id){
        throw new ApiError(400, "Only owner can edit comment")
    }

    const newComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {content}
        },
        {new: true}
    )

    if(!newComment){
        throw new ApiResponse(400, "failed to update comment")
    }

    return req
    .status(200)
    .json(
        new ApiResponse(200, newComment, "Comment updated successfully")
    )

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Comment Id")
    }

    const oldComment = await Comment.findById(commentId)

    if(!oldComment){
        throw new ApiError(400, "Comment not found")
    }

    if(oldComment.owner?._id !== req.user._id){
        throw new ApiError(401, "Only Owners can delete comment")
    }

    const deletedComment = await Comment.findByIdAndDelete(
        commentId
    )

    if(!deleteComment){
        throw new ApiError(400, "failed to delete Comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deleteComment, "Comment deleted Successfully")
    )


})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }