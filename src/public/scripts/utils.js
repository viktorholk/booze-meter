// This file contains general method used for the BAC calculations and creating the datasets for the chart

// Method that calculates the BAC from gender, amount of drinks and weight
// Uses the widmarkFactor to calculate
function calculateBAC(gender, amount, weight) {
  const widmarkFactor = gender === 0 ? 0.68 : 0.55;
  return Math.max((amount * 12) / (weight * widmarkFactor), 0);
}

// We need to format the data from the api so we can present it in the chart
function generateDatasets(user, entries) {
  // Since the entries from the API can be filled with gaps
  // Gaps where no entries has been made in that time, but we still want to present it on the chart, just as a 0 for no drinks
  let patchedEntries = [];

  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i];

    // Save the date using the moment library
    entry.date = moment(entry.date);

    // If i > 0 we can conclude that it is possible that there is a time gap between the 2 entries
    if (i > 0) {
      // Get the previous date and get det difference between the two
      const previousDate = patchedEntries[patchedEntries.length - 1].date;
      const elapsedTime = entry.date.diff(previousDate, 'hours') - 1;

      // Start the loop at 1 since it is in hours we are adding
      for (let j = 1; j <= elapsedTime; j++) {
        // Clone the entry so we dont mutate
        let newEntry = _.clone(entry);
        newEntry.total_amount = 0;
        // Increment the date with the elapsed hours
        newEntry.date = moment(previousDate).add(j, 'hours');
        patchedEntries.push(newEntry);
      }
    }

    patchedEntries.push(entry);
  }

  // This is the general value for alcohol metabolism
  const metabolismRate = 0.15;
  // We will store all our BAC calculations in this variables
  let calculations = [];

  for (let i = 0; i < patchedEntries.length; i++) {
    const entry = patchedEntries[i];

    // If total_amount > 0 we will calculate the BAC, and if there are previous calculations we will add them and subtract with the metabolism rate
    if (entry.total_amount > 0) {
      BAC = calculateBAC(user.gender, entry.total_amount, user.weight);
      if (i > 0) {
        const previousBAC = calculations[i - 1] || 0;
        BAC += previousBAC;
        // Make sure we don't go below 0, with Math.max
        BAC = Math.max(BAC - metabolismRate, 0);
      }
    } else {
      // No drinks has been consumed this hour so just subtract the metabolism
      // Make sure we don't go below 0 with Math.max
      BAC = Math.max(calculations[i - 1] - metabolismRate, 0);
    }

    calculations.push(Math.max(BAC.toFixed(2), 0));
  }

  return { patchedEntries, calculations };
}
