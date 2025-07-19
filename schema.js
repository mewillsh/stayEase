const Joi = require("joi");
const Listing = require("./models/listing");
const Review=require("./models/reviews");
//At the time of passing value from Postman Use Listing[] not listing[]
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().uri().allow("", null),
      filename: Joi.string().allow("", null),
    }).optional(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string().required(),
    geometry: Joi.object({
      type: Joi.string().valid("Point").required(),
      coordinates: Joi.array()
        .items(Joi.number()) // [longitude, latitude]
        .length(2)
        .required(),
    }).optional(), // optional if you're not passing it from frontend/postman
  }).required(),
});

module.exports.reviewsSchema=Joi.object({
  review:Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required()
})