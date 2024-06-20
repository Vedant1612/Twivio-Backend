import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video Id")
    }

    const likedVideo = await Like.findOne(
        {
            video: videoId,
            likedBy: req.user?._id
        }
    )

    if(likedVideo){
        await Like.findByIdAndDelete(
            likedVideo?._id
        )

        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, " Video disliked successfully")
        )
    }

    const videoLiked = await Like.create(
        {
            video: videoId,
            likedBy: req.user?._id
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, videoLiked, "Video Liked successfully")
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Comment Id")
    }

    const likedComment = await Like.findOne(
        {
            comment: commentId,
            likedBy: req.user?._id
        }
    )

    if(likedComment){
        await Like.findByIdAndDelete(
                likedComment?._id
        )

        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Comment disliked successfully")
        )
    }

    const commentLiked = await Like.create(
        {
            comment: commentId,
            likedBy: req.user?._id
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,commentLiked, "comment liked successfully")
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid Tweet Id")
    }

    const likedTweet = await Like.findOne(
        {
            tweet: tweetId,
            likedBy: req.user?._id
        }
    )

    if(likedTweet){
        await Like.findByIdAndDelete(
                likedTweet?._id
        )

        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Tweet disliked successfully")
        )
    }

    const tweetLiked = await Like.create(
        {
            tweet: tweetId,
            likedBy: req.user?._id
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,tweetLiked, "Tweet liked successfully")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner"
                        }
                    },
                ]
            }
        },
        {
            $addFields: {
                videoCount: {
                    $size: "$videos"
                }
            }
        },
        {
            $unwind: "$videos"
        },
        {
            $project: {
                videos: {
                    _id: 1,
                    videoFile: 1,
                    thumbnail: 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    updatedAt: 1,
                    views: 1,
                    owner: {
                        username: 1,
                        avatar: 1
                    }
                },
                videoCount: 1,
                updatedAt: 1,
            }
        }
    ])


    return res.status(200)
    .json(new ApiResponse(200, "Liked videos fetched successfully", likedVideos))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}