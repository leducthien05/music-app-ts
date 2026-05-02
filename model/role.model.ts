import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    title: String,
    description: String,
    permission: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        default: 'active'
    },
    deleted: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});
const Role =  mongoose.model('Role', roleSchema, 'role');
export default Role;