const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeMirror(page) {
    const url = `https://mirror-h.org/search/hacker/ID/pages/${page}`;
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        let hasData = false;

        $("table tbody tr").each((index, element) => {
            $(element)
                .find("td")
                .each((i, el) => {
                    const text = $(el).text().trim();
                    if (text.startsWith("http")) {
                        try {
                            const domain = new URL(text).hostname;
                            console.log(domain);
                            hasData = true;
                        } catch (e) {
                            console.log("Geçersiz URL:", text);
                        }
                    }
                });
        });

        
        return hasData;

    } catch (error) {
        console.error(`Hata oluştu (Sayfa ${page}):`, error);
        return false; 
    }
}

(async () => {
    let page = 0;

    while (true) { 
        const hasData = await scrapeMirror(page);

        if (!hasData) {
            break; 
        }

        page++; 
    }
})();
