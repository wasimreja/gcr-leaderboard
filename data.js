const csv = require("csv-parser");
const fs = require("fs");
const results = [];
const resultsWithRank = [];
const quests = "# of Quests Completed",
	skillBadges = "# of Skill Badges Completed";
fs.createReadStream("data/data.csv")
	.pipe(csv())
	.on("data", (data) => results.push(data))
	.on("end", () => {
		let id = 0;
		let institute = results[0]["Institution"];
		results.forEach((result) => {
			delete result["Enrolment Date & Time"];
			delete result["Google Cloud Skills Boost Profile URL"];
			delete result["Institution"];
			delete result["Student Email"];
			result.id = id++;
		});
		results.sort(
			(a, b) =>
				Number(b[quests]) +
					Number(b[skillBadges]) -
					(Number(a[quests]) + Number(a[skillBadges])) ||
				a["Student Name"] - b["Student Name"]
		);
		let rank = 1;

		results[0]["Rank"] = rank;

		for (let pointer = 1; pointer < results.length; pointer++) {
			let totalNumberOfQuestsCompletedByPreviousRank =
				Number(results[pointer - 1][quests]) +
				Number(results[pointer - 1][skillBadges]);
			let totalNumberOfQuestsCompleted =
				Number(results[pointer][quests]) + Number(results[pointer][skillBadges]);

			if (totalNumberOfQuestsCompleted === 0) {
				rank++;
				results[pointer]["Rank"] = rank;
			}
			else if (
				totalNumberOfQuestsCompletedByPreviousRank ===
				totalNumberOfQuestsCompleted
			) {
				results[pointer]["Rank"] = results[pointer - 1]["Rank"];
			} else {
				rank++;
				results[pointer]["Rank"] = rank;
			}
		}

		results.forEach((result) => {
			let obj = {
				Rank: result["Rank"],
				"Student Name": result["Student Name"],
				"Enrolment Status": result["Enrolment Status"],
				"# of Quests Completed": result[quests],
				"# of Skill Badges Completed": result[skillBadges],
				id: result["id"],
			};

			resultsWithRank.push(obj);
		});

		fs.writeFile(
			"data/data.json",
			JSON.stringify({
				resultsWithRank,
				buildDate: new Date(Date.now()).toDateString(),
				institute,
			}),
			(err) => {
				if (err) throw err;
				console.log("Data file has been saved!");
			}
		);
	});
