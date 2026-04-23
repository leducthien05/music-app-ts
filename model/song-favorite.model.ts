import mongoose from "mongoose";

const singerSchema = new mongoose.Schema({
    user_id: String,
    song_id: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    },
    {
        timestamps: true
    }
);

const Favorite = mongoose.model("Favorite", singerSchema, "favorites");
export default Favorite;