function getAIresponse() {

const https = require('https');
const readline = require('readline');

// Replace the API key below with your own key
const apiKey = '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';
const completionsEndpoint = 'https://api.openai.com/v1/completions';

// Initialize readline interface for command-line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt the user for a text prompt to generate a completion
rl.question('Please search the web and scan the website on how suspicious is the website:', (website) => {
  // Initialize the data to send in the HTTP request
  const data = JSON.stringify({
    prompt: `Scan the website ${website} and provide a summary of how suspicious it appears:`,
    max_tokens: 50,
    model: "text-davinci-003",
    temperature: 0.5
  });

  // Initialize the HTTP request options
  const options = {
    hostname: 'api.openai.com',
    path: '/v1/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Authorization': `Bearer ${apiKey}`,
    },
  };

  // Send the HTTP request to the OpenAI completions endpoint
  const req = https.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => {
      responseBody += chunk;
    });
    res.on('end', () => {
      // Parse the response body as JSON
      const response = JSON.parse(responseBody);

      if (response.hasOwnProperty('choices') && response.choices.length > 0) {
        // Print the generated completion to the console
        console.log(response.choices[0].text);
      } else {
        console.error(`Error generating completion: ${response.error.message}`);
      }

      // Close the readline interface
      rl.close();
    });
  });

  // Handle any errors that occur during the HTTP request
  req.on('error', (error) => {
    console.error(`Error sending HTTP request: ${error}`);
  });

  // Send the data in the HTTP request body
  req.write(data);
  req.end();
});
}
return ( 
    <div>
        {getAIresponse()}
    </div>
);