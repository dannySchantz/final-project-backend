export function validatePost(input) {
    const validationErrors = {}
  
    if (!('title' in input) || input['title'].length === 0) {
      validationErrors['title'] = 'cannot be blank'
    }
  
    if (!('description' in input) || input['description'].length === 0) {
      validationErrors['description'] = 'cannot be blank'
    }
  
    // if (!('tags' in input) || !Array.isArray(input['tags']) || input['tags'].length === 0) {
    //   validationErrors['tags'] = 'must be a non-empty array'
    // }
  
    return validationErrors
  }
  