const axios = require('axios');
const fs = require('fs');

const url = 'https://api.graphql.imdb.com/?operationName=BatchPage_HomeMain&variables=%7B%22fanPicksFirst%22%3A30%2C%22first%22%3A30%2C%22locale%22%3A%22en-US%22%2C%22placement%22%3A%22home%22%2C%22topPicksFirst%22%3A30%2C%22topTenFirst%22%3A10%7D&extensions=%7B%22persistedQuery%22%3A%7B%22sha256Hash%22%3A%22ba826e05a878dcaae5ada43b6c238bbba989725da4ddc335d654f0036bf31f59%22%2C%22version%22%3A1%7D%7D';

axios.get(url)
  .then(response => {
    // Check if there's data to process
    if (response.data && response.data.data && response.data.data.topMeterTitles) {
      const movies = response.data.data.topMeterTitles.edges.map(edge => {
        return {
          id: edge.node.id,
          title: edge.node.titleText.text,
          image: edge.node.primaryImage.url,
          releaseYear: edge.node.releaseYear.year,
          rating: edge.node.ratingsSummary.aggregateRating
        };
      });

         // Save the data to a JSON file
         fs.writeFile('imdb_api_data.json', JSON.stringify(movies, null, 2), (err) => {
            if (err) {
              console.error('Error writing to file', err);
            } else {
              console.log('Data successfully saved to imdb_api_data.json');
            }
          });
        } else {
          console.log('No data found in the response.');
        }
      })
      .catch(error => {
        console.error('Error fetching data from the IMDb API:', error);
      });
 
