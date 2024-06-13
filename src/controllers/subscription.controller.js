import mongoose, {isValidObjectId} from "mongoose"
// import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { log } from "console"
// import { read } from "fs"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid Channel Id")
    }

    const isSubscribed = await Subscription.findOne({
        subscriber: req.user?._id,
        cahnnel: channelId
    })

    if(isSubscribed){
        await Subscription.findByIdAndDelete(isSubscribed._id)

        return res
        .status(200)
        .json(
            new ApiResponse(200, {subscribed: false}, "Channel unsubscribed successfully")
        )
    }

    await Subscription.create({
        subscriber: req.user?._id,
        cahnnel: channelId
    })

    // if(!channelSubscribed){
    //     throw new ApiError(500, channelSubscribed, "failed to subscribed the channel")
    // }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {subscribed: true}, "Channel subscribed successfully")
    )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    console.log(channelId)
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid Channel_Id")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscribers"
            }
        },
        {
            $unwind: "subscribers"
        },
        {
            $project: {
                _id: 1,
                subscriber: {
                    _id: "$subscribers._id",
                    username: "subscriber.username",
                    fullname: "$subscribers.fullname",
                    avatar: "$subscribers.avatar"
                }
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid Subscriber Id")
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channels",
                pipeline: [
                    {
                        $lookup: {
                            from: "videos",
                            localField: "_id",
                            foreignField: "owner",
                            as: "channelVideos"
                        }
                    },
                    {
                        $addFields: {
                            latestVideo: {
                                $last: "$channelVideos" 
                            }
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$channels"
        },
        {
            $project: {
                _id: 1,
                subscribedChannel: {
                    _id: "$channels._id",
                    username: "$channels.username",
                    fullname: "$channels.fullname",
                    avatar: "$channels.avatar",
                    latestVideo: {
                        _id: "$channels.latestVideo._id",
                        videoFile: "$channels.latestVideo.videoFile",
                        thumbnail: "$channels.latestVideo.thumbnail",
                        title: "$channels.latestVideo.title",
                        description: "$channels.latestVideo.description",
                        duration: "$channels.latestVideo.duration",
                        views: "$channels.latestVideo.views",
                        owner: "$channels.latestVideo.owner",
                        createdAt: "$channels.latestVideo.createdAt"
                    }
                }
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, subscribedChannels, "Subscribered channel fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}