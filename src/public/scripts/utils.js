// This file contains general method used for the BAC calculations and creating the datasets for the chart

// Method that calculates the BAC from gender, amount of drinks and weight
// Uses the widmarkFactor to calculate
function calculateBAC(entry, user) {
  if (entry.amount == 0) return 0;

  // Default weight to 80 kg and gender to male
  const weight = user.weight || 80;
  const gender = user.gender || 0;

  const widmarkFactor = gender === 0 ? 0.68 : 0.55;

  // 0.779 is the density of the ethanol
  const alcoholInGrams = (entry.volume * entry.alcoholPercentage * 0.789) / 100;

  return Math.max((entry.amount * alcoholInGrams) / (weight * widmarkFactor), 0);
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
        let newEntry = {
          date: moment(entry.date),
          amount: 0
        };
        // Increment the date with the elapsed hours
        newEntry.date = moment(previousDate).add(j, 'hours');
        patchedEntries.push(newEntry);
      }
    }

    patchedEntries.push(entry);
  }

  // Regroup the patched entries by the date
  // This is because there can be multiple entries within the same hour being different drinks

  let groupedEntries = {};

  for (entry of patchedEntries) {
    const exists = groupedEntries[entry.date] !== undefined;

    const newEntry = _.omit(entry, 'date');

    if (exists) {
      groupedEntries[entry.date].push(newEntry);
    } else groupedEntries[entry.date] = [newEntry];
  }

  // This is the general value for alcohol metabolism
  const metabolismRate = 0.15;

  // Calculate the BAC value of each entry
  let calculations = [];

  for (const [date, entries] of Object.entries(groupedEntries)) {
    let BAC = _.sum(_.map(entries, (e) => calculateBAC(e, user)));

    if (calculations.length > 0) {
      const previous = calculations[calculations.length - 1];

      BAC += previous;
      BAC = Math.max(BAC - metabolismRate, 0);
    }

    calculations.push(BAC);
  }

  // Now we have handled all the entries up until the last
  // But we also want to feed the graph until the BAC is at 0.0
  // After burn

  let latestBAC = calculations[calculations.length - 1];

  const hoursRemaining = Math.ceil(latestBAC / 0.15);

  const dates = Object.keys(groupedEntries);

  for (let i = 0; i < hoursRemaining; i++) {
    const date = moment(dates[dates.length - 1]).add(i + 1, 'hours');

    groupedEntries[date] = [{ amount: 0 }];
    calculations.push(Math.max(latestBAC - 0.15 * (i + 1), 0));
  }

  return { groupedEntries, calculations };
}
