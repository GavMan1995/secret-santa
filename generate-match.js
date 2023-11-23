const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase URL and API key
const supabaseUrl = 'https://hafbfqhcafolhrfqnefa.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk0MTgxNiwiZXhwIjoxOTU0NTE3ODE2fQ._6pAo1ovILPQbiwYI7-65irVke3m_u2dQzkgDxUGcpc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateMatchValues() {

  // Fetch all rows from the lerohl table without explicit ordering
  const { data, error } = await supabase.from('lerohl').select('*');

  if (error) {
    console.error('Error fetching data:', error.message);
    return;
  }

  updateRows(data)
}

async function updateRows(data) {
  const allNames = data.map((row) => row.name);
  let unmatchedNames = [...allNames];
  let matchedNames = [];
  let unmatchedRows = [...data];

      // Update each row with a match value
  for (const row of data) {
    let matchValue = findMatchValue(row, unmatchedNames, matchedNames);

    // Retry the matching process until the criteria are met
    if (
      matchValue === row.name ||
      matchedNames.includes(matchValue) ||
      (row.exception && row.exception.includes(matchValue))
    ) {
        console.log('Retrying...')
      updateRows(data);
    } else {
      // Update the row with the final generated match value
      await supabase.from('lerohl').update({ match: matchValue }).eq('id', row.id);

      // Remove the matched names and rows from the unmatched lists
      const matchedIndex = unmatchedNames.indexOf(matchValue);
      unmatchedNames.splice(matchedIndex, 1);
      matchedNames.push(matchValue);

      const matchedRowIndex = unmatchedRows.findIndex((r) => r.name === matchValue);
      unmatchedRows.splice(matchedRowIndex, 1);
    }
  }
}

function findMatchValue(row, unmatchedNames, matchedNames) {
  console.log('Finding match value for', row.name, 'with exception', row.exception);
  const availableNames = unmatchedNames.filter(
    (n) => n !== row.name && (!row.exception || (row.exception && !row.exception.includes(n))) && !matchedNames.includes(n)
  );

  if (availableNames.length > 0) {
    return availableNames[Math.floor(Math.random() * availableNames.length)]
  } else { 
    return row.name
  }
}

// Call the function to generate match values and update the table
supabase.from('lerohl').update({ match: null }).then(() => {
    generateMatchValues();
})

