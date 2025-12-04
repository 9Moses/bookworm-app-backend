import {rateLimit} from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 60000, // 1-minute time window for request limiting
    limit: 60, // Allow a maximum of 60 requests per minute
    standardHeaders: 'draft-8', //Use the latest standard rate-limit headers
    legacyHeaders: false,
    message:{
        error:  "You have sent too many requests in a short period of time. Please try again later.",
    }
});

export default limiter