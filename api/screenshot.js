import chromium from 'chrome-aws-lambda';
import playwright from 'playwright-core';

module.exports = async (req, res) => {
    let browser = null
    const { query } = req
    try {
        if (query.url && isValidUrl(query.url)) {
            browser = await playwright.chromium.launch({ 
                args: chromium.args,
                executablePath: await chromium.executablePath,
                headless: chromium.headless
        })

        const page = await browser.newPage()
        await page.goto(query.url, {
            timeout: 15*1000
        })

        const screenshot = await page.screenshot({ 
            type: "png" 
        })

        res.setHeader("Content-Type", "image/png")
        res.status(200).send(screenshot)
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