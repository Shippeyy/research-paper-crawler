
import * as fs from 'fs'
import * as axiosImport from 'axios'
const axios = axiosImport.default

// constants
const ITERATIONS = 10
const API_KEY = "INSERT_API_KEY_HERE"
const DATE = new Date()
const OUTPUT_PATH = "data/crawl_" + DATE.getDay() + "_" + DATE.getMonth() + "_" + DATE.getFullYear() + ".csv"

// set up the request parameters
const params = {
	api_key: API_KEY,
	q: "hci measuring trust",
	search_type: "scholar",
	time_period: "custom",
	time_period_min: "01/01/2000",
	output: "json",
	hl: "en",
	scholar_year_min: "2010",
	page: "1"
}

console.log("Started at " + DATE.toLocaleString())
void run()

async function run(): Promise<void> {
	const papers = []
	const promises = []
	for (let i = 1; i <= ITERATIONS; i++) {
		params.page = i.toString()
		const promise = scrape()
		promise.then((results: any) => {
			results.scholar_results.forEach(result => papers.push(result))
		})
		promises.push(promise)
	}

	// wait for all results to resolve
	await Promise.all(promises)

	// parse results into a csv format
	let data = "title;displayed link;link" + "\n"
	papers.forEach(paper => data += paper.title + ";" + paper.displayed_link + ";" +  paper.link + "\n")

	fs.writeFile(OUTPUT_PATH, data, (err) => {
		if (err)
			console.log(err);
		else {
			console.log("File written successfully\n");
		}
	});
}

async function scrape(): Promise<string> {
	return axios.get('https://api.scaleserp.com/search', { params }).then(result => {
		return result.data
	})
}