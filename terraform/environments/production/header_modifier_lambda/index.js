exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;
  
  // Get the AppRunner domain from origin
  const appRunnerDomain = request.origin.custom.domainName;

  // Get the origin header
  const originHeader = headers.origin && headers.origin[0] ? headers.origin[0].value : null;

  if (originHeader && originHeader.includes('cityquokka.com')) {
    // Set x-forwarded-host to match the domain in origin
    headers['x-forwarded-host'] = [{ 
      key: 'X-Forwarded-Host', 
      value: 'cityquokka.com'
    }];
  }
  
  // Modify the host header to match AppRunner domain
  headers['host'] = [{
      key: 'Host',
      value: appRunnerDomain
  }];
  
  return request;
};