exports.handler = async (event) => {
  // For Lambda@Edge, the request object is nested differently
  // The structure is: event.Records[0].cf.request
  var request;
  
  // Check if this is a CloudFront event (Lambda@Edge)
  if (event.Records && event.Records[0] && event.Records[0].cf) {
      request = event.Records[0].cf.request;
  } else {
      // Fallback for direct Lambda invocation
      request = event.request || event;
  }
  
  // Ensure request and request.uri exist
  if (!request || !request.uri) {
      console.log('Invalid request structure:', JSON.stringify(event, null, 2));
      // Return a default response or the original event
      return request || event;
  }
  
  var originalImagePath = request.uri;
  
  // Validate, process and normalize the requested operations in query parameters
  var normalizedOperations = {};
  
  if (request.querystring) {
        request.querystring.split('&').forEach(queryParam => {
          const [operation, value] = queryParam.split('=');
          switch (operation.toLowerCase()) {
              case 'format': 
                  var SUPPORTED_FORMATS = ['auto', 'jpeg', 'webp', 'avif', 'png', 'svg', 'gif'];
                  if (value && SUPPORTED_FORMATS.includes(value.toLowerCase())) {
                      var format = value.toLowerCase();
                      if (format === 'auto') {
                          format = 'jpeg';
                          if (request.headers && request.headers['accept']) {
                              if (request.headers['accept'].value.includes("avif")) {
                                  format = 'avif';
                              } else if (request.headers['accept'].value.includes("webp")) {
                                  format = 'webp';
                              } 
                          }
                      }
                      normalizedOperations['format'] = format;
                  }
                  break;
              case 'width':
                  if (value) {
                      var width = parseInt(value);
                      if (!isNaN(width) && (width > 0)) {
                          // you can protect the Lambda function by setting a max value
                          if (width > 4000) width = 4000;
                          normalizedOperations['width'] = width.toString();
                      }
                  }
                  break;
              case 'height':
                  if (value) {
                      var height = parseInt(value);
                      if (!isNaN(height) && (height > 0)) {
                          // you can protect the Lambda function by setting a max value
                          if (height > 4000) height = 4000;
                          normalizedOperations['height'] = height.toString();
                      }
                  }
                  break;
              case 'quality':
                  if (value) {
                      var quality = parseInt(value);
                      if (!isNaN(quality) && (quality > 0)) {
                          if (quality > 100) quality = 100;
                          normalizedOperations['quality'] = quality.toString();
                      }
                  }
                  break;
              case 'focus':
                if (/^(\d{1,2}|100)_(\d{1,2}|100)$/.test(value)){
                  normalizedOperations['focus'] = value
                }
                break;
              default: break;
          }
      });
      
      // Rewrite the path to normalized version if valid operations are found
      if (Object.keys(normalizedOperations).length > 0) {
          // Put them in order
          var normalizedOperationsArray = [];
          if (normalizedOperations.format) normalizedOperationsArray.push('format='+normalizedOperations.format);
          if (normalizedOperations.quality) normalizedOperationsArray.push('quality='+normalizedOperations.quality);
          if (normalizedOperations.width) normalizedOperationsArray.push('width='+normalizedOperations.width);
          if (normalizedOperations.height) normalizedOperationsArray.push('height='+normalizedOperations.height);
          if (normalizedOperations.focus) normalizedOperationsArray.push('focus='+normalizedOperations.focus);
          request.uri = originalImagePath + '/' + normalizedOperationsArray.join(',');     
      } else {
          // If no valid operation is found, flag the request with /original path suffix
          request.uri = originalImagePath + '/original';     
      }
  } else {
      // If no query strings are found, flag the request with /original path suffix
      request.uri = originalImagePath + '/original'; 
  }
  
  // Remove query strings
  request['querystring'] = {};
  
  return request;
}