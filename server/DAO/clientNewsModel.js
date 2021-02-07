const mongoose = require('mongoose')

const news = {
    newsHeadline: String,
    newsSummary: String,
    newsSource: String,
    relevanceScore: String,
    newsURL: String,
    imageURL: String,
    publishedDate: String
}

const clientNewsSchema = new mongoose.Schema({
    clientId: {
        type: Number,
        unique: true,
        required: true,
    },
    name: String,
    contactInfo: String,
    interests: String,
    clientNews: [news]
}, {
    autoCreate: true
})

clientNewsSchema.methods.errorMessageForRetrievingClientNews = () => {
    const errorMessage = "Error retrieving news for Client: " + this.clientId;
    console.log(console.error(errorMessage));
}

clientNewsSchema.methods.successMessage = () => {
    const successMessage = "New client news has been created for Client: " + this.clientId;
    return successMessage;
}

clientNewsSchema.set('toObject', {
    transform: function (doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.id
    }
  })

const ClientNews = mongoose.model('clientNews', clientNewsSchema)

module.exports = ClientNews;