const {TimeFrame} = require("./TimeFrame");

// path and fs are required to manipulate files and directories.
const path = require("path");
const fs = require("fs");

// Creating the output directories:
const resultDirPath = path.join(__dirname, "../result-data/");
fs.mkdirSync(resultDirPath);


// Pre-fetching all the data files from `test-data`, 
// and storing data from each json file in an array:
let allData = [];
for (let i = 1; i <= 3; i++) {
    allData.push(require(`../test-data/data${i}.json`));
}





const process = (timeframeCode) => {

    const duration = TimeFrame[timeframeCode];
    // Creating folder timeframeCode to store results.
    fs.mkdirSync(`${resultDirPath}${timeframeCode}`);


    
    // Iterating through allData Array that contains data from each json file:
    allData.forEach((data, index) => {

        let partitions = {};
        // Partitions would store the measures for every partition in the timeframe as a key-value pair.
        // PartitionIndex would be the key, and the measures recorded in the partition are stored in an array as value.
        // For a duration of 'x' milliseconds, [0 to x] is the first partition (0th index), 
        // [x to 2x] is the second [1st index], [2x to 3x] is the third, and so on.

        // Iterating through each item in the json file:
        data.forEach( datum => { 
            // Did you know that "datum" is the singular for "data" 😉
            const timeStamp = datum[0];
            const measure = datum[1];

            const partitionIndex = Math.floor(timeStamp / duration); 
            if (!(partitionIndex in partitions)) {
                // Initialise with an array if partition index (key in the object) doesn't exist.
                partitions[partitionIndex] = [];
            }
            // Add measure to array:
            partitions[partitionIndex] = [...partitions[partitionIndex], measure];

        });

        // Sort the keys of partitions (partition-index) in ascending order
        partitionIndices = Object.keys(partitions).map(Number);

        partitionIndices.sort((a, b) => a - b); // The argument passed is a function used to sort in ascending order

        const smallestPartitionIndex = partitionIndices[0];
        const largestPartitionIndex = partitionIndices[partitionIndices.length - 1] + 1;

        let outputJSON = [];
        // Converting every partition into a result array [a, b, c]
        for (let i = smallestPartitionIndex; i < largestPartitionIndex; i++) {
            const a = i * duration; // start of the partition
            const b = a + duration; // end of the partition
            
            // Find the average of measures:
            // If i is in partitions, then get the array of measures, else use an empty array for finding average.
            const measures = (i in partitions) ? partitions[i] : [];
            let sum = 0;
            measures.forEach(measure => {
                sum += measure;
            });
            const count = measures.length;
            
            // Calculate the average only if count is not 0, else the average is 0.
            const c = count ? sum / count : 0;
            outputJSON.push([a, b, c]);
        }

        // Create the file for output at location ./result-data/timeframeCode/data-${index + 1}.json
        fs.writeFileSync(`${resultDirPath}${timeframeCode}/data${index + 1}.json`, JSON.stringify(outputJSON));

    });
}

const main = () => {
    let start = Date.now();
    for(let timeframe in TimeFrame){
        process(timeframe);
    }
    let time = Date.now() - start;
    console.log("TASK WAS COMPLETED IN " + time + " MS");
}

main();
