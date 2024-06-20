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
            new ApiResponse(200, { isLiked: false }, " Video disliked successfully")
        )
    }

    await Like.create(
        {
            video: videoId,
            likedBy: req.user?._id
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, { isLiked: true }, "Video Liked successfully")
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
            new ApiResponse(200, { isLiked: false }, "Comment disliked successfully")
        )
    }

    await Like.create(
        {
            comment: commentId,
            likedBy: req.user?._id
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, { isLiked: true }, "comment liked successfully")
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
            new ApiResponse(200, { tweetId, isLiked: false }, "Tweet disliked successfully")
        )
    }

    await Like.create(
        {
            tweet: tweetId,
            likedBy: req.user?._id
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, { isLiked: true }, "Tweet liked successfully")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideosAggegate = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideo",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                        },
                    },
                    {
                        $unwind: "$ownerDetails",
                    },
                ],
            },
        },
        {
            $unwind: "$likedVideo",
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $project: {
                _id: 0,
                likedVideo: {
                    _id: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    owner: 1,
                    title: 1,
                    description: 1,
                    views: 1,
                    duration: 1,
                    createdAt: 1,
                    isPublished: 1,
                    ownerDetails: {
                        username: 1,
                        fullName: 1,
                        "avatar.url": 1,
                    },
                },
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideosAggegate,
                "liked videos fetched successfully"
            )
        );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}