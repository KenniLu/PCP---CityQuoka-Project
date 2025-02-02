interface AddressResult {
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  country: string
}

export class AustralianAddressParser {
  private readonly states: string[];

  constructor() {
    // Australian state abbreviations
    this.states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];
  }

  public parse(addressString: string): AddressResult {
    // Remove Unit and street number at the beginning
    addressString = addressString.replace(/^[^,]+,/i, '');
    // Remove Australia from the end if present
    addressString = addressString.replace(/, Australia$/i, '');
    
    // Initialize the result object
    const result: AddressResult = {
      suburb: null,
      state: null,
      postcode: null,
      country: 'Australia'
    };

    // Extract postcode and state
    const postcodeStateMatch = addressString.match(/,?\s*([A-Z]{2,3})\s+(\d{4})$/);
    if (postcodeStateMatch) {
      const [_, state, postcode] = postcodeStateMatch;
      result.state = state;
      result.postcode = postcode;
      // Remove the matched portion from the address string
      result.suburb = addressString.replace(/,?\s*[A-Z]{2,3}\s+\d{4}$/, '');
    }

    return result;
  }

}
