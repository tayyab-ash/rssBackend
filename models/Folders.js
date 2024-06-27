const mongoose = require('mongoose');
const { Schema } = mongoose;
const Items = require('./Items')

const FolderSchema = new Schema({
    folders: [
        {
            name: {
                type: String,
                required: true
            },
            items: [{
                type: mongoose.Schema.Types.ObjectId, ref: Items
            }]
        }
    ]
});

const Folders = mongoose.model("folders", FolderSchema);
module.exports = Folders;

