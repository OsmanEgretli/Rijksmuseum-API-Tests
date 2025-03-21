# Rijksmuseum API Automation

This project contains automated tests for the Rijksmuseum API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add your API key:
```
API_KEY=your_api_key_here
BASE_URL=https://www.rijksmuseum.nl/api/en
```

## Running Tests

To run the tests:
```bash
npm test
```

## Test Cases

The test suite includes:
- Getting collection items
- Getting specific artwork details
- Searching the collection

## Adding More Tests

To add more test cases, edit the `tests/rijksmuseum.test.js` file. The API documentation can be found at: https://data.rijksmuseum.nl/object-metadata/api 