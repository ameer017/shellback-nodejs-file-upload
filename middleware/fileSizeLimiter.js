const MB = 5 //5mb
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
    const files = req.files;

    const  filesOverLimit = []

    //which file are over limit?
    Object.keys(files).forEach(key => {
        if(files[key].size > FILE_SIZE_LIMIT) {
            filesOverLimit.push(files[key].name)
        }
    })

    if(filesOverLimit.length) {
        const properVerb = filesOverLimit.length > 1 ? 'are' : 'is';

        const sentence = `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB}.`.replaceAll(",", ", ");

        const message = filesOverLimit.length < 3 ? 
        sentence.replace(",", "and") : 
        sentence.replace(/,(?=[^,]*$)/, " and")

        // The HTTP 413 Content Too Large response status code indicates that the request entity is larger than limits defined by server
        
        return res.status(413).json({ status: "error", message })
    }

    next()
}

module.exports = fileSizeLimiter