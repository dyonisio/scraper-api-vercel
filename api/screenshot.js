const playwright = require("playwright-aws-lambda")

module.exports = async (req, res) => {
    let browser = null
    const { query } = req
    try {
        if (query.url && isValidUrl(query.url)) {
            browser = await playwright.launchChromium({ headless: true })

            res.status(200)
        } else throw "Please provide a valid url"
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            error: `Error: ${error.name} | Message ${error.message}`,
        })
    } finally {
        if (browser !== null) {
            await browser.close()
        }
    }
}

function isValidUrl(string) {
    try {
        new URL(string)
    } catch (_) {
        return false
    }
    return true
}